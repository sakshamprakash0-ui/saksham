package com.example.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.blur
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.BebasNeueFontFamily
import com.example.ui.theme.MontserratFontFamily
import com.example.ui.theme.ViceGold
import com.example.ui.theme.VicePink
import com.example.ui.theme.VicePinkGlow

@Composable
fun GtaViLogo(modifier: Modifier = Modifier) {
    val infiniteTransition = rememberInfiniteTransition(label = "vi_neon")
    val pulseGlow by infiniteTransition.animateFloat(
        initialValue = 0.7f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(1800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "vi_glow_pulse"
    )

    Column(
        horizontalAlignment = Alignment.End,
        modifier = modifier.testTag("gta_vi_logo")
    ) {
        // "GRAND THEFT AUTO" Header
        Text(
            text = "GRAND THEFT AUTO",
            fontFamily = MontserratFontFamily,
            fontSize = 11.sp,
            fontWeight = FontWeight.Black,
            letterSpacing = 5.sp,
            color = Color.White
        )

        Row(verticalAlignment = Alignment.CenterVertically) {
            // Neon glowing "VI"
            Box(contentAlignment = Alignment.Center) {
                // Neon blur underglow
                Text(
                    text = "VI",
                    fontFamily = BebasNeueFontFamily,
                    fontSize = 52.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 2.sp,
                    color = VicePinkGlow,
                    modifier = Modifier
                        .blur(8.dp)
                        .alpha(pulseGlow)
                )

                // Gradient text overlay
                Text(
                    text = "VI",
                    fontFamily = BebasNeueFontFamily,
                    fontSize = 52.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 2.sp,
                    style = TextStyle(
                        brush = Brush.verticalGradient(
                            colors = listOf(
                                Color.White,
                                VicePink,
                                ViceGold
                            )
                        )
                    )
                )
            }
        }
    }
}
