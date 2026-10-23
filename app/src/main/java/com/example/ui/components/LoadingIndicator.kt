package com.example.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.BebasNeueFontFamily
import com.example.ui.theme.MontserratFontFamily
import com.example.ui.theme.ViceCyan
import com.example.ui.theme.ViceGold
import com.example.ui.theme.VicePink
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun LoadingIndicator(
    progress: Float,
    statusText: String,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "spinner_rot")
    val rotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(2200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "rot_anim"
    )

    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = modifier
            .testTag("loading_progress_bar")
            .clip(RoundedCornerShape(8.dp))
            .background(Color(0xD90A0612))
            .border(1.dp, Color(0x33FFFFFF), RoundedCornerShape(8.dp))
            .padding(horizontal = 14.dp, vertical = 8.dp)
    ) {
        // Rotating Ammo Chamber / Star Spinner
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(34.dp)
                .rotate(rotation)
        ) {
            Canvas(modifier = Modifier.size(34.dp)) {
                val center = Offset(size.width / 2, size.height / 2)
                val radius = size.minDimension / 2 - 2.dp.toPx()

                // Outer ring
                drawCircle(
                    color = VicePink.copy(alpha = 0.5f),
                    radius = radius,
                    style = Stroke(width = 2.dp.toPx())
                )

                // 6 cylinder chambers
                val chamberRadius = 3.dp.toPx()
                val chamberDistance = radius * 0.6f
                for (i in 0 until 6) {
                    val angle = (i * 60.0) * Math.PI / 180.0
                    val cx = center.x + (chamberDistance * cos(angle)).toFloat()
                    val cy = center.y + (chamberDistance * sin(angle)).toFloat()
                    drawCircle(
                        color = if (i % 2 == 0) ViceGold else Color.White,
                        radius = chamberRadius,
                        center = Offset(cx, cy)
                    )
                }

                // Center pin
                drawCircle(
                    color = VicePink,
                    radius = 2.5.dp.toPx()
                )
            }
        }

        Spacer(modifier = Modifier.width(12.dp))

        Column(modifier = Modifier.width(260.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = statusText.uppercase(),
                    fontFamily = MontserratFontFamily,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.SemiBold,
                    letterSpacing = 1.sp,
                    color = ViceCyan,
                    modifier = Modifier.weight(1f),
                    maxLines = 1
                )
                Text(
                    text = "${(progress * 100).toInt()}%",
                    fontFamily = BebasNeueFontFamily,
                    fontSize = 18.sp,
                    letterSpacing = 1.sp,
                    color = Color.White
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            // Progress bar line
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(4.dp)
                    .clip(RoundedCornerShape(2.dp))
                    .background(Color(0xFF261D33))
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(fraction = progress.coerceIn(0.02f, 1f))
                        .fillMaxHeight()
                        .clip(RoundedCornerShape(2.dp))
                        .background(
                            Brush.horizontalGradient(
                                colors = listOf(VicePink, ViceGold)
                            )
                        )
                )
            }
        }
    }
}
