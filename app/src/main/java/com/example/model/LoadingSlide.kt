package com.example.model

data class LoadingSlide(
    val id: String,
    val title: String,
    val subtitle: String,
    val tagline: String,
    val quote: String,
    val lore: String,
    val gameplayTip: String,
    val assetFileName: String
)

object SlideRepository {
    val slides = listOf(
        LoadingSlide(
            id = "jason_lucia_01",
            title = "JASON & LUCIA",
            subtitle = "OCEAN BEACH, VICE CITY",
            tagline = "Leonida's Most Wanted",
            quote = "\"The only way we get through this is together. Trust me.\"",
            lore = "Cruising along Ocean Drive in a tuned muscle car, Jason and Lucia navigate the high-stakes underworld of Vice City.",
            gameplayTip = "Keep an eye on police dispatch chatter over the police scanner to anticipate roadblock locations.",
            assetFileName = "Jason_and_Lucia_01_landscape_613da459.jpg"
        ),
        LoadingSlide(
            id = "cal_hampton",
            title = "CAL HAMPTON",
            subtitle = "VICE WATERWAYS, LEONIDA",
            tagline = "Bayou Survivalist & Courier",
            quote = "\"Patriot Beer, sunshine, and no badges within ten miles. Paradise.\"",
            lore = "Cal navigates the intricate mangrove swamps and canals of Vice County, providing unmarked boat charters and discreet transport.",
            gameplayTip = "Watercraft avoid standard highway checkpoints and traffic cameras when escaping high wanted levels.",
            assetFileName = "Cal_Hampton_landscape_f833d68e.jpg"
        ),
        LoadingSlide(
            id = "gas_robbery",
            title = "HIGHWAY 17 HOLD-UP",
            subtitle = "XERO GAS & CONVENIENCE",
            tagline = "Kelly County Outskirts",
            quote = "\"Thirty seconds inside. In and out before the sheriff can radio dispatch.\"",
            lore = "Targeting rural convenience stores yields quick cash scores, but quick getaways require a fast car and clean plates.",
            gameplayTip = "Equipping bandanas before committing robberies delays police identification and reduces initial wanted stars.",
            assetFileName = "Jason_and_Lucia_Robbery_landscape_93b7d77f.jpg"
        ),
        LoadingSlide(
            id = "boobie_ike",
            title = "BOOBIE IKE",
            subtitle = "CLUB TAMBOURINE, PORT GELLHORN",
            tagline = "Vice City Nightlife Impresario",
            quote = "\"Cash flows like champagne around here, but loyalty is priceless.\"",
            lore = "Boobie Ike oversees the premier VIP lounge in Port Gellhorn, where underground syndicates and luxury entertainment collide.",
            gameplayTip = "Purchasing nightlife venues generates recurring passive revenue and unlocks discreet laundering operations.",
            assetFileName = "Boobie_Ike_landscape_dfd30edf.jpg"
        ),
        LoadingSlide(
            id = "lock_and_load",
            title = "LOCK AND LOAD",
            subtitle = "SUNSET HIGHWAY, LEONIDA",
            tagline = "Tactical Preparation",
            quote = "\"Check your chamber. When sirens start, there are no second chances.\"",
            lore = "Careful weapon customization and body armor ensure the crew is always ready for intense shootouts against rival crews.",
            gameplayTip = "Ammu-Nation provides ballistic suppressors and extended magazines to keep small arms engagements stealthy.",
            assetFileName = "Jason_Lucia_Lock_And_Load_landscape_70ff911e.jpg"
        ),
        LoadingSlide(
            id = "dock_getaway",
            title = "THE HARBOR RUN",
            subtitle = "BISCAYNE MARINA",
            tagline = "Biscayne Bay Escape",
            quote = "\"Helicopter overhead! Gun the throttles and head for open water!\"",
            lore = "With Vice City Police Department interceptors closing in, Jason and Lucia secure the prize and make a daring break across the bay.",
            gameplayTip = "Aiming for helicopter tail rotors with high-caliber rounds can disable aerial pursuit units quickly.",
            assetFileName = "Jason_and_Lucia_02_landscape_f90ef861.jpg"
        ),
        LoadingSlide(
            id = "beach_sunset",
            title = "SUNSET EMPIRE",
            subtitle = "VICE BEACH SKYLINE",
            tagline = "Partners in Crime",
            quote = "\"We either take this city together, or we burn trying.\"",
            lore = "As the warm sunset glows over the palm trees, Vice City's neon signs flicker to life for another wild night of opportunity.",
            gameplayTip = "Tune into Leonida radio stations to hear local talk shows, satirical commercials, and curated soundtrack hits.",
            assetFileName = "Jason_and_Lucia_Beach_landscape_cb6ead2b.jpg"
        )
    )
}
