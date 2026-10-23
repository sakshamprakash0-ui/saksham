package com.example.audio

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlin.math.PI
import kotlin.math.sin

/**
 * Procedural retro analog synthesizer generating ambient Vice City sunset chords.
 * Zero external audio files required, lightweight, pure real-time PCM audio.
 */
class SynthAudioPlayer {
    private val scope = CoroutineScope(Dispatchers.Default)
    private var audioTrack: AudioTrack? = null
    private var playbackJob: Job? = null

    private val _isPlaying = MutableStateFlow(true)
    val isPlaying: StateFlow<Boolean> = _isPlaying.asStateFlow()

    private val _isMuted = MutableStateFlow(false)
    val isMuted: StateFlow<Boolean> = _isMuted.asStateFlow()

    fun start() {
        if (playbackJob != null && playbackJob?.isActive == true) return
        _isPlaying.value = true

        val sampleRate = 44100
        val bufferSize = AudioTrack.getMinBufferSize(
            sampleRate,
            AudioFormat.CHANNEL_OUT_STEREO,
            AudioFormat.ENCODING_PCM_16BIT
        ).coerceAtLeast(8192)

        audioTrack = AudioTrack.Builder()
            .setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build()
            )
            .setAudioFormat(
                AudioFormat.Builder()
                    .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                    .setSampleRate(sampleRate)
                    .setChannelMask(AudioFormat.CHANNEL_OUT_STEREO)
                    .build()
            )
            .setBufferSizeInBytes(bufferSize)
            .setTransferMode(AudioTrack.MODE_STREAM)
            .build()

        audioTrack?.play()

        playbackJob = scope.launch {
            // Chord progression frequencies (Hz):
            // 1. Fm9: F3 (174.61), C4 (261.63), Eb4 (311.13), G4 (392.00), Ab4 (415.30)
            // 2. Dbmaj7: Db3 (138.59), Ab3 (207.65), C4 (261.63), F4 (349.23)
            // 3. Bbm9: Bb2 (116.54), F3 (174.61), Ab3 (207.65), C4 (261.63), Db4 (277.18)
            // 4. Eb7: Eb3 (155.56), Bb3 (233.08), Db4 (277.18), G4 (392.00)
            val chords = listOf(
                floatArrayOf(174.61f, 261.63f, 311.13f, 392.00f, 415.30f),
                floatArrayOf(138.59f, 207.65f, 261.63f, 349.23f),
                floatArrayOf(116.54f, 174.61f, 207.65f, 261.63f, 277.18f),
                floatArrayOf(155.56f, 233.08f, 277.18f, 392.00f)
            )

            var chordIndex = 0
            val chunkSize = 2048
            val pcmData = ShortArray(chunkSize * 2) // Stereo (L, R)
            var phase = DoubleArray(6) { 0.0 }
            var subPhase = 0.0
            var sampleCount = 0L

            val chordDurationSamples = sampleRate * 5 // 5 seconds per chord

            while (isActive) {
                if (_isMuted.value || !_isPlaying.value) {
                    audioTrack?.setVolume(0.0f)
                    delay(100)
                    continue
                } else {
                    audioTrack?.setVolume(0.85f)
                }

                val currentChord = chords[chordIndex]
                val samplesIntoChord = (sampleCount % chordDurationSamples).toInt()

                // Envelope: smooth attack & decay
                val envelope = when {
                    samplesIntoChord < 15000 -> samplesIntoChord / 15000f
                    samplesIntoChord > chordDurationSamples - 20000 -> (chordDurationSamples - samplesIntoChord) / 20000f
                    else -> 1.0f
                }

                for (i in 0 until chunkSize) {
                    val t = (sampleCount + i).toDouble() / sampleRate
                    // Slow LFO for retro chorus / vibrato
                    val vibrato = 1.0 + 0.003 * sin(2.0 * PI * 4.2 * t)
                    val tremolo = 0.9 + 0.1 * sin(2.0 * PI * 0.5 * t)

                    var mixedSample = 0.0
                    for (noteIdx in currentChord.indices) {
                        val freq = currentChord[noteIdx] * vibrato
                        phase[noteIdx] += 2.0 * PI * freq / sampleRate
                        if (phase[noteIdx] > 2.0 * PI) phase[noteIdx] -= 2.0 * PI

                        // Soft warm synth voice (fundamental + gentle 2nd harmonic)
                        val voice = sin(phase[noteIdx]) + 0.35 * sin(2.0 * phase[noteIdx])
                        mixedSample += voice
                    }

                    // Add subtle deep bass root
                    val rootFreq = currentChord[0] * 0.5
                    subPhase += 2.0 * PI * rootFreq / sampleRate
                    if (subPhase > 2.0 * PI) subPhase -= 2.0 * PI
                    val bass = 0.6 * sin(subPhase)

                    val finalSample = ((mixedSample / currentChord.size * 0.6 + bass * 0.4) * envelope * tremolo * 14000.0)
                        .coerceIn(-32000.0, 32000.0)
                        .toInt()
                        .toShort()

                    // Subtle stereo widening
                    val leftSample = (finalSample * (0.95 + 0.05 * sin(2.0 * PI * 0.3 * t))).toInt().toShort()
                    val rightSample = (finalSample * (0.95 - 0.05 * sin(2.0 * PI * 0.3 * t))).toInt().toShort()

                    pcmData[i * 2] = leftSample
                    pcmData[i * 2 + 1] = rightSample
                }

                audioTrack?.write(pcmData, 0, pcmData.size)
                sampleCount += chunkSize

                if (sampleCount % chordDurationSamples < chunkSize) {
                    chordIndex = (chordIndex + 1) % chords.size
                }
            }
        }
    }

    fun toggleMute() {
        _isMuted.value = !_isMuted.value
    }

    fun release() {
        playbackJob?.cancel()
        playbackJob = null
        try {
            audioTrack?.stop()
            audioTrack?.release()
        } catch (_: Exception) {
        }
        audioTrack = null
    }
}
