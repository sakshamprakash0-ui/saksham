package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = VicePink,
    onPrimary = Color.White,
    primaryContainer = VicePurple,
    onPrimaryContainer = Color.White,
    secondary = RockstarGold,
    onSecondary = Color.Black,
    tertiary = ViceCyan,
    background = ViceDarkBg,
    onBackground = Color.White,
    surface = ViceDarkBg,
    onSurface = Color.White,
    surfaceVariant = ViceCardBg,
    onSurfaceVariant = TextMuted
)

@Composable
fun MyApplicationTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
