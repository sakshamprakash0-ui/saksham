package com.example.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.VolumeMute
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.BebasNeueFontFamily
import com.example.ui.theme.RockstarGold
import com.example.ui.theme.ViceGold
import com.example.ui.theme.VicePink

@Composable
fun SlideControls(
    currentIndex: Int,
    totalSlides: Int,
    isAutoPlaying: Boolean,
    isMuted: Boolean,
    onPrevious: () -> Unit,
    onNext: () -> Unit,
    onToggleAutoPlay: () -> Unit,
    onToggleMute: () -> Unit,
    onSelectSlide: (Int) -> Unit,
    onEnterGame: () -> Unit,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "enter_glow")
    val enterAlpha by infiniteTransition.animateFloat(
        initialValue = 0.8f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "enter_button_glow"
    )

    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = modifier
            .testTag("slide_controls_bar")
            .clip(RoundedCornerShape(24.dp))
            .background(Color(0xD90A0612))
            .border(1.dp, Color(0x33FFFFFF), RoundedCornerShape(24.dp))
            .padding(horizontal = 10.dp, vertical = 6.dp)
    ) {
        // Previous Button
        IconButton(
            onClick = onPrevious,
            modifier = Modifier
                .testTag("prev_slide_button")
                .size(36.dp)
        ) {
            Icon(
                imageVector = Icons.Default.ChevronLeft,
                contentDescription = "Previous Slide",
                tint = Color.White
            )
        }

        // Slide Dots / Indicators
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            for (i in 0 until totalSlides) {
                val isSelected = i == currentIndex
                Box(
                    modifier = Modifier
                        .height(8.dp)
                        .width(if (isSelected) 22.dp else 8.dp)
                        .clip(CircleShape)
                        .background(
                            if (isSelected) VicePink else Color(0x66FFFFFF)
                        )
                        .clickable { onSelectSlide(i) }
                )
            }
        }

        // Next Button
        IconButton(
            onClick = onNext,
            modifier = Modifier
                .testTag("next_slide_button")
                .size(36.dp)
        ) {
            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = "Next Slide",
                tint = Color.White
            )
        }

        Spacer(
            modifier = Modifier
                .width(1.dp)
                .height(20.dp)
                .background(Color(0x33FFFFFF))
        )

        // Play / Pause Auto-advance
        IconButton(
            onClick = onToggleAutoPlay,
            modifier = Modifier
                .testTag("toggle_autoplay_button")
                .size(36.dp)
        ) {
            Icon(
                imageVector = if (isAutoPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                contentDescription = if (isAutoPlaying) "Pause Slideshow" else "Resume Slideshow",
                tint = if (isAutoPlaying) ViceGold else Color.Gray
            )
        }

        // Audio Mute / Unmute Toggle with sound wave visualizer
        IconButton(
            onClick = onToggleMute,
            modifier = Modifier
                .testTag("toggle_sound_button")
                .size(36.dp)
        ) {
            Icon(
                imageVector = if (isMuted) Icons.Default.VolumeMute else Icons.Default.VolumeUp,
                contentDescription = if (isMuted) "Unmute Ambient Audio" else "Mute Ambient Audio",
                tint = if (isMuted) Color.Gray else RockstarGold
            )
        }

        Spacer(
            modifier = Modifier
                .width(1.dp)
                .height(20.dp)
                .background(Color(0x33FFFFFF))
        )

        // "ENTER GAME" Action Button
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .testTag("enter_game_button")
                .clip(RoundedCornerShape(16.dp))
                .background(
                    Brush.horizontalGradient(
                        colors = listOf(
                            VicePink.copy(alpha = enterAlpha),
                            ViceGold.copy(alpha = enterAlpha)
                        )
                    )
                )
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = ripple(color = Color.White)
                ) { onEnterGame() }
                .padding(horizontal = 14.dp, vertical = 6.dp)
        ) {
            Text(
                text = "ENTER GAME",
                fontFamily = BebasNeueFontFamily,
                fontSize = 15.sp,
                letterSpacing = 1.sp,
                color = Color.Black
            )
        }
    }
}
