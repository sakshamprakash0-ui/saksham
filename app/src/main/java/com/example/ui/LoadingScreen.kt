package com.example.ui

import androidx.compose.animation.Crossfade
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.example.audio.SynthAudioPlayer
import com.example.model.SlideRepository
import com.example.ui.components.GameReadyScreen
import com.example.ui.components.GtaViLogo
import com.example.ui.components.LoadingIndicator
import com.example.ui.components.RockstarHeader
import com.example.ui.components.SlideControls
import com.example.ui.components.SlideInfoCard
import com.example.ui.theme.MontserratFontFamily
import kotlinx.coroutines.delay

@Composable
fun LoadingScreen(
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val slides = SlideRepository.slides

    var currentSlideIndex by remember { mutableIntStateOf(0) }
    var isAutoPlaying by remember { mutableStateOf(true) }
    var showGameReady by remember { mutableStateOf(false) }

    // Loading progress & engine status
    var progress by remember { mutableFloatStateOf(0.12f) }
    var statusText by remember { mutableStateOf("INITIALIZING RAGE ENGINE...") }

    // Audio synthesizer
    val audioPlayer = remember { SynthAudioPlayer() }
    val isMuted by audioPlayer.isMuted.collectAsState()

    DisposableEffect(Unit) {
        audioPlayer.start()
        onDispose {
            audioPlayer.release()
        }
    }

    // Auto-advance slideshow timer
    LaunchedEffect(currentSlideIndex, isAutoPlaying) {
        if (isAutoPlaying) {
            delay(7500)
            currentSlideIndex = (currentSlideIndex + 1) % slides.size
        }
    }

    // Progress bar simulation
    LaunchedEffect(Unit) {
        val stages = listOf(
            0.15f to "INITIALIZING RAGE ENGINE 9...",
            0.28f to "STREAMING OCEAN DRIVE ASSETS...",
            0.42f to "CALIBRATING VOLUMETRIC SUNSET...",
            0.58f to "LOADING LEONIDA WATERWAYS & ARCHIPELAGO...",
            0.73f to "SYNCHRONIZING VICE CITY POLICE TELEMETRY...",
            0.88f to "POPULATING METROPOLITAN TRAFFIC...",
            0.96f to "CONFIGURING AMMU-NATION WEAPON CACHES...",
            1.00f to "LEONIDA SESSION READY"
        )

        for ((targetProg, text) in stages) {
            statusText = text
            while (progress < targetProg) {
                delay(60)
                progress = (progress + 0.015f).coerceAtMost(targetProg)
            }
            delay(600)
        }
    }

    // Ken Burns zoom animation per slide
    val scaleAnim = remember { Animatable(1.04f) }
    LaunchedEffect(currentSlideIndex) {
        scaleAnim.snapTo(1.04f)
        scaleAnim.animateTo(
            targetValue = 1.14f,
            animationSpec = tween(durationMillis = 8000, easing = LinearEasing)
        )
    }

    val currentSlide = slides[currentSlideIndex]

    if (showGameReady) {
        GameReadyScreen(
            onReturnToLoader = { showGameReady = false },
            modifier = modifier
        )
        return
    }

    Box(
        modifier = modifier
            .testTag("gta6_loading_screen_root")
            .fillMaxSize()
            .background(Color.Black)
            .pointerInput(Unit) {
                var dragTotal = 0f
                detectHorizontalDragGestures(
                    onDragStart = { dragTotal = 0f },
                    onDragEnd = {
                        if (dragTotal > 60f) {
                            // Swiped right -> Previous
                            currentSlideIndex = (currentSlideIndex - 1 + slides.size) % slides.size
                        } else if (dragTotal < -60f) {
                            // Swiped left -> Next
                            currentSlideIndex = (currentSlideIndex + 1) % slides.size
                        }
                    },
                    onHorizontalDrag = { _, dragAmount ->
                        dragTotal += dragAmount
                    }
                )
            }
    ) {
        // Background Artwork with Crossfade and Ken Burns Scale
        Crossfade(
            targetState = currentSlide,
            animationSpec = tween(900),
            label = "slide_crossfade"
        ) { slide ->
            AsyncImage(
                model = ImageRequest.Builder(context)
                    .data("file:///android_asset/images/${slide.assetFileName}")
                    .crossfade(true)
                    .build(),
                contentDescription = "${slide.title} artwork",
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxSize()
                    .scale(scaleAnim.value)
            )
        }

        // Vignette & Cinematic Dark Gradients
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color(0x99000000),
                            Color.Transparent,
                            Color(0x66000000),
                            Color(0xCC000000)
                        )
                    )
                )
        )

        // Top Bar: Rockstar Games Presents (Left), Slide Controls (Center), GTA VI Logo (Right)
        Row(
            verticalAlignment = Alignment.Top,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 20.dp)
                .align(Alignment.TopCenter)
        ) {
            RockstarHeader()

            SlideControls(
                currentIndex = currentSlideIndex,
                totalSlides = slides.size,
                isAutoPlaying = isAutoPlaying,
                isMuted = isMuted,
                onPrevious = {
                    currentSlideIndex = (currentSlideIndex - 1 + slides.size) % slides.size
                },
                onNext = {
                    currentSlideIndex = (currentSlideIndex + 1) % slides.size
                },
                onToggleAutoPlay = { isAutoPlaying = !isAutoPlaying },
                onToggleMute = { audioPlayer.toggleMute() },
                onSelectSlide = { currentSlideIndex = it },
                onEnterGame = { showGameReady = true }
            )

            GtaViLogo()
        }

        // Bottom Bar: Slide Info Vignette (Left) & Loading Indicator (Right)
        Row(
            verticalAlignment = Alignment.Bottom,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 22.dp)
                .align(Alignment.BottomCenter)
        ) {
            SlideInfoCard(slide = currentSlide)

            Column(horizontalAlignment = Alignment.End) {
                LoadingIndicator(
                    progress = progress,
                    statusText = statusText
                )

                Text(
                    text = "© 2026 ROCKSTAR GAMES, INC. GRAND THEFT AUTO AND ROCKSTAR GAMES ARE TRADEMARKS.",
                    fontFamily = MontserratFontFamily,
                    fontSize = 8.sp,
                    color = Color(0x66FFFFFF),
                    modifier = Modifier.padding(top = 6.dp)
                )
            }
        }
    }
}
