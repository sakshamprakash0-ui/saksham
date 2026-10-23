package com.example.ui.components

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.LoadingSlide
import com.example.ui.theme.BebasNeueFontFamily
import com.example.ui.theme.MontserratFontFamily
import com.example.ui.theme.RockstarGold
import com.example.ui.theme.ViceCyan
import com.example.ui.theme.VicePink

@Composable
fun SlideInfoCard(
    slide: LoadingSlide,
    modifier: Modifier = Modifier
) {
    AnimatedContent(
        targetState = slide,
        transitionSpec = { fadeIn() togetherWith fadeOut() },
        label = "slide_info_anim",
        modifier = modifier.testTag("slide_info_card")
    ) { currentSlide ->
        Column(
            modifier = Modifier
                .widthIn(max = 520.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color(0xE610091E),
                            Color(0xF208040F)
                        )
                    )
                )
                .border(
                    width = 1.dp,
                    brush = Brush.horizontalGradient(
                        colors = listOf(
                            VicePink.copy(alpha = 0.7f),
                            ViceCyan.copy(alpha = 0.4f),
                            Color.Transparent
                        )
                    ),
                    shape = RoundedCornerShape(12.dp)
                )
                .padding(horizontal = 18.dp, vertical = 14.dp)
        ) {
            // Location / Region tag
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(6.dp)
                        .clip(CircleShape)
                        .background(ViceCyan)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = currentSlide.subtitle.uppercase(),
                    fontFamily = MontserratFontFamily,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 2.sp,
                    color = ViceCyan
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "•",
                    color = Color.Gray,
                    fontSize = 10.sp
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = currentSlide.tagline.uppercase(),
                    fontFamily = MontserratFontFamily,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Medium,
                    letterSpacing = 1.sp,
                    color = RockstarGold
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            // Main Title
            Text(
                text = currentSlide.title,
                fontFamily = BebasNeueFontFamily,
                fontSize = 32.sp,
                letterSpacing = 2.sp,
                color = Color.White
            )

            // Quote
            Text(
                text = currentSlide.quote,
                fontFamily = MontserratFontFamily,
                fontSize = 12.sp,
                fontStyle = FontStyle.Italic,
                fontWeight = FontWeight.Medium,
                color = Color(0xFFE2DDF0),
                lineHeight = 16.sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Gameplay Tip Footer
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(Color(0x33FFFFFF))
                    .padding(horizontal = 10.dp, vertical = 6.dp)
            ) {
                Text(
                    text = "TIP",
                    fontFamily = BebasNeueFontFamily,
                    fontSize = 13.sp,
                    letterSpacing = 1.sp,
                    color = RockstarGold
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = currentSlide.gameplayTip,
                    fontFamily = MontserratFontFamily,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Normal,
                    color = Color(0xFFF3F0FA),
                    lineHeight = 15.sp
                )
            }
        }
    }
}
