# PX-56 copy changes

Original wording and final replacements. Dates, roles, links, technical options, and code examples are preserved.

## src/lib/work.ts

**Before**

An XRP Ledger explorer with analytics, wallet scoring, and fund tracing. I designed, built, and ran it myself, and it is now open source.

**After**

An XRP Ledger explorer I designed, built, and ran, with portfolio tracking, wallet scoring, and fund tracing. Now open source.

**Before**

I wanted an account page that made sense before you knew the ledger’s terminology. I used type and spacing to put the balance, holdings, and recent activity first, with the technical detail farther down.

**After**

I put the balance, holdings, and recent activity at the top of the account page. You could check what an account held before getting into the ledger’s technical details.

**Before**

The balance leads, then value, reserve and age, then the tabs.

**After**

Balance, value, reserve, and account age sit above the tabs.

**Before**

Three readers, three depths

**After**

Different levels of detail

**Before**

Different readers needed different levels of detail. A newcomer might want to see what an account holds. A trader might need profit and loss, cost basis, and allocation. An analyst might want raw transaction data or fund tracing. I organized the account tabs around that progression and kept the live updates visually quiet.

**After**

Someone new to the ledger might only need an account’s holdings. A trader might want profit and loss, cost basis, and allocation. An analyst might need raw transactions or fund tracing. I organized the tabs so people could get to the level of detail they needed.

**Before**

Nothing blanks while it loads

**After**

Loading and live updates

**Before**

Search took an address, transaction identifier, ledger number, or token name and opened the matching view. Account pages had twelve tabs, from transactions and holdings to NFTs, liquidity pools, offers, and escrows. Sections loaded independently, so readers could start with the balance and holdings while other requests finished, and live updates kept the previous results visible until new data arrived.

**After**

Search accepted addresses, transaction IDs, ledger numbers, and token names. Account pages had twelve tabs covering transactions, holdings, NFTs, liquidity pools, offers, and escrows. Each section loaded separately, so people could read the balance and holdings while the rest loaded. During live updates, existing data stayed visible until the new results arrived.

**Before**

The app also covered network metrics, price charts, trading data, a wallet-connected portfolio, and a token directory, with separate databases for the app, analytics, and fund tracing.

**After**

Beyond account pages, I built network metrics, price charts, trading views, a wallet-connected portfolio, and a token directory. The app, analytics, and fund-tracing tools used separate databases.

**Before**

An AI assistant, Ask the Ledger, took questions in plain English and could query those tools in a conversation.

**After**

Ask the Ledger let people ask questions in plain English. The AI assistant could query the investigation tools as part of the conversation.

**Before**

An identity for a measuring tool

**After**

Name and visual identity

**Before**

A sonde is a probe used to take measurements. The name suited a tool for looking into ledger activity. I used dark slate surfaces and muted neutrals, with salmon (#E8856C) for key metrics and live indicators.

**After**

A sonde is a measuring probe, which felt like a good name for a ledger explorer. I used dark slate backgrounds with a salmon accent (#E8856C) for key metrics and live indicators.

**Before**

Satoshi handled display type, DM Sans the interface and body copy, and IBM Plex Mono the addresses, hashes, and amounts. Small colored tags distinguished payments, trades, NFT operations, trust lines, and liquidity-pool activity without coloring entire rows.

**After**

I used Satoshi for headings, DM Sans for interface text, and IBM Plex Mono for addresses, hashes, and amounts. Small colored tags identify transaction types, including payments, trades, NFTs, trust lines, and liquidity-pool activity.

**Before**

The landing page, with salmon as the one accent.

**After**

The landing page uses the same salmon accent as the app.

**Before**

I launched Sonde with a public explorer, analytics, and paid portfolio and investigation tools. Subscriptions accepted fiat and crypto. After launch I changed the pricing: the whole explorer became free, and Pro, at $5 a month, added Claude-powered questions. I handled design, development, and operations. I closed the hosted app when infrastructure costs outran subscription revenue, and published the code on GitHub under the MIT license.

**After**

Sonde launched with a public explorer, analytics, and paid portfolio and investigation tools. Subscriptions accepted fiat and crypto. I later made the full explorer free, with Claude-powered questions available on the $5-a-month Pro plan. I handled design, development, and operations. When infrastructure costs exceeded subscription revenue, I closed the hosted app and released the code on GitHub under the MIT license.

**Before**

The pricing after the change, in July 2026: the whole explorer free, and Pro at $5 a month for Claude-powered questions.

**After**

July 2026 pricing: a free explorer and a $5-a-month Pro plan for Claude-powered questions.

**Before**

Product, brand, and front end for a personal finance app covering budgets, accounts, and investments.

**After**

A personal finance app for budgets, accounts, and investments. I designed the product and brand and built the front end.

**Before**

Pocketwatch brought budgeting, net worth, and investments into one app. We were a team of two: I owned the product, brand, design, and front end, and my partner Chris built the backend, including auth, and ran the business side.

**After**

Pocketwatch brought budgeting, net worth, and investments into one app. I handled product design, branding, and the front end. My partner Chris built the backend, including authentication, and ran the business side.

**Before**

One ledger for everything

**After**

Accounts, budgets, and investments

**Before**

The product combined a zero-based budget, a transaction ledger for cash and credit accounts, investment tracking, manual assets, and a net-worth view. The design challenge was helping people move between those views without losing track of which accounts and figures they were looking at.

**After**

Pocketwatch combined zero-based budgeting, a transaction ledger for cash and credit accounts, investment tracking, manually entered assets, and net worth. I needed to make the relationship between those views clear, so people could tell which accounts and balances they were looking at.

**Before**

Shared settings controlled type, color, spacing, and motion. Satoshi handled display type, Inter the interface, and JetBrains Mono the figures. Consistent number widths helped balances line up in tables. The same motion rules applied throughout, including reduced motion.

**After**

I defined shared styles for type, color, spacing, and motion. Headings use Satoshi, interface text uses Inter, and figures use JetBrains Mono so balances line up in tables. The motion settings also include a reduced-motion mode.

**Before**

I drew the mark as an eye peeking out of a pocket: a small, slightly odd character to go with the name. Its simple shape worked as an app icon and beside the Satoshi wordmark.

**After**

The logo is an eye peeking out of a pocket. I wanted a slightly odd little character that worked as both an app icon and part of the wordmark.

**Before**

The main palette was near-black and white with a citron-green accent. I kept the rest of the identity simple so the mark could carry the personality.

**After**

I paired it with a Satoshi wordmark and a near-black, white, and citron-green palette.

**Before**

A desktop app for the last step of brand work: logo packages, palettes, type specimens, and image conversion, with a command line and an MCP server. I designed and built it.

**After**

A desktop app I designed and built to prepare brand files for handoff: logo packages, color palettes, type specimens, and converted images.

**Before**

Toolbox is a desktop app for the last step of brand work. It turns logo SVGs into a complete print and web package, exports palettes as code and swatches, makes type specimens, and converts images. I designed and built it. It runs on macOS and Linux, and a command line and an MCP server let scripts and AI agents use the same tools.

**After**

I designed and built Toolbox to handle the file preparation that comes with brand work. It packages logos for print and web, exports color palettes, makes type specimens, and converts images. It runs on macOS and Linux, with the same tools available from the app, command line, or an AI assistant through MCP.

**Before**

Lockup takes one SVG per logo variation and exports an organized package: print and web folders, color, black, and white versions, several sizes, optional square social versions, and a README. Print PDF and EPS files can carry named Pantone spot colors. Palette exports colors as CSS and SCSS variables, design tokens, Adobe swatches, or a reference sheet. Specimen makes a type sheet from installed fonts, and Convert changes image formats, sizes, and compression.

**After**

Lockup turns logo SVGs into a folder of print and web files, with color, black, and white versions, multiple sizes, optional social images, and a README. PDF and EPS exports support named Pantone spot colors. Palette makes code, swatches, and reference sheets from a set of colors. Specimen makes type sheets from installed fonts. Convert handles image formats, resizing, and compression.

**Before**

Work is organized by project, one client or job each. Every export goes into a new folder instead of replacing an earlier delivery, and saved settings let a package be reopened and exported again. The library stays on the computer, and exported files stay in the folders you choose.

**After**

Projects keep each client or job together. You can save the settings, reopen the work, and export it again. Each export gets a new folder, so earlier deliveries stay intact. The project library and exported files are stored on your computer.

**Before**

Palette samples a poster’s colors into swatches; Specimen sets a type sheet from installed fonts.

**After**

Palette extracts colors from artwork. Specimen previews a type sheet.

**Before**

Convert measures each file’s size per format; the home screen lists the four tools.

**After**

Convert shows the output size for each format. The home screen lists all four tools.

**Before**

Each tool runs three ways: in the app, from the command line, and through an MCP server that AI agents can call. The command line and MCP take the same options as the app’s controls, and they can inspect inputs, preview results, and reopen saved work before exporting.

**After**

The command line and MCP server support the same settings as the app. Scripts and AI assistants can inspect source files, preview results, reopen saved work, and export without opening a window.

**Before**

Toolbox 1.1.1 is available for macOS, signed and notarized, and for Linux as AppImage and deb packages. I stopped making Windows builds at 1.1.0 rather than pay for code signing. Downloads, tool guides, and the command-line reference are on this site.

**After**

Toolbox 1.1.1 is available for macOS and Linux. The macOS builds are signed and notarized; Linux builds come as AppImage and deb packages. I dropped Windows support at 1.1.0 because of the cost of code signing. Downloads and guides are on this site.

**Before**

Rebranding the NFT club I cofounded in 2021 and building its website: a logo, palette, and typeface from one 5×5 grid, and a site with live stats, a gallery, and a playable rowing game.

**After**

A new identity and website for the NFT club I cofounded in 2021, including a custom pixel typeface, live collection stats, and a rowing game.

**Before**

I cofounded Pixel Ape Rowboat Club in 2021 and have led its branding and art direction since. For the 2026 rebrand I drew a new logo on the apes’ 5×5 grid and built PARC Pixel, a three-weight typeface, then designed and built the club’s website on the same grid: live stats, a gallery, a playable rowing game, and merch.

**After**

I cofounded Pixel Ape Rowboat Club in 2021 and have led its branding and art direction since. In 2026, I redesigned the identity around the apes’ 5×5 grid, made the PARC Pixel typeface, and built a new website with live stats, a gallery, merch, and a rowing game.

**Before**

Around 2024 I had worked up a different direction: the club’s parts renamed as three branches, The Rowboat Club, The Parcade, and The Nightclub, each a black pixel wordmark with its own icon: an oar, a red joystick, and a red microphone. We all agreed it looked good, but it didn’t fit the brand: too serious and too dark, not playful enough. We set it aside.

**After**

Around 2024, I explored splitting the club into three branches: The Rowboat Club, The Parcade, and The Nightclub. Each had a black pixel wordmark and an icon: an oar, a red joystick, or a red microphone. We liked the design, but it felt too serious and dark for PARC. We set it aside.

**Before**

Same people, better brand

**After**

Redrawing the logo

**Before**

The scripts couldn’t make a 2 that read as a 2 in any weight. So I built a small editor for placing pixels by hand and let the scripts compile the fonts from it. I placed 29 glyphs across the family that way, including the bold 2, the oar, and all three at-signs, checking each in words at reading size.

**After**

The scripts struggled with some characters, especially the number 2. I built a small editor to place pixels by hand, then used the scripts to compile the fonts. I drew 29 glyphs across the family this way, including the bold 2, the oar, and all three at-signs, and checked them in words at reading size.

**Before**

title: 'In the wild'

**After**

title: 'Streams, merch, and social'

**Before**

The logo’s pixel grid became the basis for the site. I wanted it to feel like arriving on the club’s island, with places to explore: the Clubhouse, the Gallery, and PARCade. The home page opens on the wordmark on a notched paper card over a scatter of pixels. The inner pages open under a jungle canopy with drifting pixel clouds, and a hanging wooden sign carries each page’s title, introduction, and buttons.

**After**

I built the site around the logo’s pixel grid and the club’s island setting. The Clubhouse, Gallery, and PARCade each have their own place in that world. The home page opens with the wordmark on a notched paper card. Inner pages use a jungle canopy, drifting clouds, and a wooden sign for the title and introduction.

**Before**

The Gallery hangs the apes on clotheslines between two trees. Selecting a frame brings up a plaque with the ape’s name. The first version scrolled sideways and hijacked the wheel. It looked good and felt wrong, so I rebuilt it with ordinary vertical scrolling.

**After**

In the Gallery, apes hang on clotheslines between two trees. Selecting a frame opens a plaque with the ape’s name. My first version turned wheel input into sideways scrolling. It was awkward to use, so I switched to normal vertical scrolling.

**Before**

Merch was going to be an external link, but the storefront’s API let me bring the catalog onto the site. Only checkout leaves it. After Darc has a static-filled background, Discord has drifting chat bubbles, and the LARC teaser is a boathouse terminal that boots, glitches, and accepts typed input. The 404 sign says you rowed off the map.

**After**

I originally planned to link out to the merch store. Using its API meant I could put the catalog on the site and send people to the store only for checkout. Other sections have their own details: TV static for After Darc, drifting chat bubbles for Discord, and a working terminal for the LARC teaser. The 404 sign says you rowed off the map.

**Before**

For First Ledger, a token trading platform from the team behind xrp.cafe, I designed the logo, typography, and brand guidelines over about a year, including rules for using the mark beside xrp.cafe and partner logos.

**After**

I spent about a year designing the identity for First Ledger, a token trading platform from the team behind xrp.cafe. The work covered the logo, typography, brand guidelines, and layouts for use alongside xrp.cafe and partner logos.

**Before**

The wide letterforms give the name a solid, dependable feel. Helvetica Neue Extended carries through the guidelines in three weights: Heavy for headlines, Medium for subheads, and Roman for body copy.

**After**

I used Helvetica Neue Extended throughout: Heavy for headlines, Medium for subheads, and Roman for body copy.

**Before**

I delivered the logo, lockups, type system, and guidelines, including the co-branding layouts. For scale: by mid-2026 the platform had passed $1.2B in transaction volume, 165K peak users, and more than 2M wallets created.

**After**

I delivered the logo, lockups, type system, and guidelines, including the co-branding layouts. By mid-2026, First Ledger had passed $1.2B in transaction volume, 165K peak users, and more than 2M wallets created.

**Before**

I cofounded xrp.cafe, an NFT marketplace on the XRP Ledger, and was its founding designer. From 2021 to 2024, I developed the identity and made the campaign graphics, animations, event booths, and community content.

**After**

As cofounder and founding designer of xrp.cafe, I developed the identity for an NFT marketplace on the XRP Ledger. From 2021 to 2024, I also made its campaign graphics, animations, event booths, and community content.

**Before**

The mascot system

**After**

The coffee mug

**Before**

We wanted it to feel like a cozy place for NFTs. The coffee mug gave us a friendly starting point for a brand that people would see every day in their feeds and chats.

**After**

We wanted xrp.cafe to feel like a friendly place to spend time. A smiling coffee mug suited the name and gave us a character to use in social posts and community chats.

**Before**

The mascot is a coffee mug with stick-figure limbs and a smile. I started with the logo, then drew a cast of mugs with different outfits and accessories for campaigns and community events.

**After**

I started with the logo, then drew versions of the mug with different outfits and accessories for campaigns and community events.

**Before**

The basic shape stayed the same while the character changed: a Halloween pumpkin, a beach-BBQ mug, a Super Saiyan. That gave me room to respond to whatever was happening without starting from scratch each time.

**After**

The same mug became a Halloween pumpkin, went to a beach BBQ, and turned Super Saiyan. I could make something for each occasion while keeping the character recognizable.

**Before**

I also made motion assets for product launches, feature announcements, and event recaps. Each focused on one feature or announcement.

**After**

Other animations covered product launches, feature announcements, and event recaps.

**Before**

For Consensus, Permissionless, and ETH Denver, I adapted the identity into booth designs, backdrops, banners, and merch. The mug connected the online brand to a place people could meet the team.

**After**

I also designed booths, backdrops, banners, and merch for Consensus, Permissionless, and ETH Denver, using the same mug characters people knew from our posts.

**Before**

The identity carried through more than ten social campaigns, motion graphics, and event booths. I also made campaign work for a VeSea charity event that raised $33K for St. Jude. For scale: by mid-2026 the marketplace had 32K followers, $16.2M in volume, and 6.7M transactions.

**After**

The work included more than ten social campaigns, motion graphics, and event booths, plus campaign graphics for a VeSea charity event that raised $33K for St. Jude. By mid-2026, the marketplace had 32K followers, $16.2M in volume, and 6.7M transactions.

**Before**

The rebuild was about search, not looks. Each treatment needed its own page that could show up in search results, with control over its content, metadata, and structured data. I built a shared treatment-page template in Next.js.

**After**

The practice needed individual treatment pages that people could find through search. I built a shared template in Next.js so each page could have its own content, metadata, and structured data.

**Before**

With dozens of treatments to cover, I wanted to make it straightforward to add a service without redesigning the page. Each treatment would have its own URL and a consistent set of questions to answer.

**After**

The template also made it easier to add treatments. Each gets its own URL and follows the same structure, so the team doesn’t need a new page design for every service.

**Before**

I rebuilt the site with Next.js and Tailwind CSS, directing the page structure and components and reviewing the implementation as Claude Code wrote it. Pages include server-rendered content, individual metadata, structured data, breadcrumbs, and a generated sitemap.

**After**

I used Next.js and Tailwind CSS for the rebuild. I designed the page structure and components, then worked with Claude Code on the implementation and reviewed the results. The site uses server-rendered pages, individual metadata, structured data, breadcrumbs, and a generated sitemap.

**Before**

The rebuilt site launched in about two months, with more than 30 pages and redirects from the first site. The practice now has 16 treatment pages on a shared template, in the same look as the first site.

**After**

The rebuild launched in about two months with more than 30 pages, including 16 treatment pages. Redirects connect the old URLs to the new pages, and the site keeps the visual identity from the Framer version.

**Before**

The client wanted an identity that felt direct and credible, with a rough mood board pointing toward retro print media. I used that reference to develop a heavy wordmark, halftone details, and a blue palette.

**After**

The client brought a rough mood board of retro print references and wanted the brand to feel direct and credible. I developed a heavy wordmark, halftone details, and a blue palette from that starting point.

**Before**

title: 'The signature look'

**After**

title: 'Print texture'

**Before**

A blue-to-cyan gradient with a layer of grain gives the backgrounds some of the texture of print. I used it in social cards, editorial layouts, and billboard mockups.

**After**

I added grain to a blue-to-cyan gradient for a printed texture, then used it across social cards, editorial layouts, and billboard mockups.

**Before**

For a class project at RMCAD, I designed and animated a speculative title sequence for Philip K. Dick’s Do Androids Dream of Electric Sheep?, the novel that inspired Blade Runner. The credits are for an imagined film adaptation. I wanted to try a graphic approach: yellow, black, and flat shapes, with Saul Bass as a reference.

**After**

For a class project at RMCAD, I made a title sequence for an imagined adaptation of Philip K. Dick’s Do Androids Dream of Electric Sheep?, the novel behind Blade Runner. I designed and animated it in yellow and black, using flat shapes and Saul Bass’s title work as a reference. The film credits are fictional.

**Before**

The yellow sky makes the black buildings feel heavier. With so little color, changes in scale and composition do most of the work.

**After**

Against the yellow sky, the black buildings feel heavy. I used changes in scale and composition to give the sequence variety within those two colors.

**Before**

I used the changes in perspective to connect the scenes and make the city feel disorienting. The sequence was cut to The Doors’ “End of the Night”; the video here is silent, and the version with sound is on YouTube.

**After**

Changes in perspective connect the scenes and make the city feel disorienting. I cut the sequence to The Doors’ “End of the Night.” The video here is silent; you can watch it with sound on YouTube.

**Before**

title: 'The system'

**After**

title: 'Logo, color, and spacing'

## src/lib/components/home/HeroStage.svelte

**Before**

Interfaces, design systems, and the front ends that run them.

**After**

Interface design, design systems, and front-end development.

## src/lib/components/home/StatementStage.svelte

**Before**

I’ve also shipped three products of my own: Sonde, an XRP Ledger analytics platform I designed, built, and ran solo; Pocketwatch, a personal finance app built with a partner on the backend; and Toolbox, a desktop app for brand deliverables. I also do brand and motion, and it shows in the product work.

**After**

I’ve also built three products: Sonde, an XRP Ledger analytics platform I ran on my own; Pocketwatch, a personal finance app I made with a backend partner; and Toolbox, a desktop app for preparing brand files. I also work on branding and motion.

## src/routes/contact/+page.svelte

**Before**

Open to full-time roles, remote or in Denver, and to contract work.

**After**

I’m available for full-time roles and contract work, remotely or in Denver.

**Before**

Or message me on LinkedIn

**After**

Message me on LinkedIn

## src/lib/toolbox.ts

**Before**

Logo files in, deliverable package out

**After**

Package logos for print and web

**Before**

Prepare logo files for a client, developer, or printer. Start with a vector SVG for each variation, then choose formats, colors, and sizes. Assign CMYK and Pantone colors for print in the app, CLI, or MCP. For a single image conversion, use Convert.

**After**

Use Lockup to prepare a set of logo files for a client, developer, or printer. Add an SVG for each logo variation, then choose the formats, colors, and sizes you need. You can assign CMYK and Pantone print colors in the app, CLI, or MCP. To convert individual images, use Convert.

**Before**

WEB and PRINT folders organized by logo variation, color treatment, and size, plus a README explaining the package. Choose PNG, JPEG, and SVG for web; JPEG, PDF, and EPS for print.

**After**

Your export contains WEB and PRINT folders, organized by logo variation, color treatment, and size. A README explains what’s included. Web formats are PNG, JPEG, and SVG; print formats are JPEG, PDF, and EPS.

**Before**

Colors in, tokens and swatches out

**After**

Export palettes as code and swatches

**Before**

Prepare a palette for a website, an Adobe project, or a brand guide. Enter hex values or extract colors from artwork. SVGs supply their fill colors; images supply their dominant colors.

**After**

Use Palette to prepare colors for a website, an Adobe project, or a brand guide. Enter hex values or import artwork. Toolbox reads fill colors from SVGs and extracts dominant colors from raster images.

**Before**

Fonts in, type sheets out

**After**

Make type specimen sheets

**Before**

Show a typeface at different sizes or compare fonts in a brand guide. Install the fonts on your computer first. Assign fonts, faces, and sizes to roles such as heading, body, and caption in the app, CLI, or MCP.

**After**

Use Specimen to show a typeface at different sizes or compare fonts for a brand guide. Install the fonts first, then choose a family, style, and size for each role, such as heading, body, or caption. The same settings are available in the app, CLI, and MCP.

**Before**

Images in, new formats and smaller files out

**After**

Convert and resize images

**Before**

Prepare images for the web, change their format, or limit their dimensions. Convert reads PNG, JPEG, WebP, GIF, BMP, ICO, AVIF, and SVG on both platforms. HEIC, TIFF, and PSD input is supported on macOS only. Use Lockup when you need a full set of logo variations.

**After**

Use Convert to change image formats, resize files, or adjust compression. Both platforms can read PNG, JPEG, WebP, GIF, BMP, ICO, AVIF, and SVG. HEIC, TIFF, and PSD input requires macOS. For a full package of logo variations, use Lockup.

**Before**

One file for each source image in each selected format. When you choose multiple formats, Toolbox puts them in separate folders, such as PNG and WebP.

**After**

Each source image is exported in every format you select. If you select more than one format, the files are grouped into folders such as PNG and WebP.

## src/routes/toolbox/+page.svelte

**Before**

lockup: 'Ready to hand over.', palette: 'Keep your colors together.',

**After**

lockup: 'Package your logos.', palette: 'Export your palette.',

**Before**

specimen: 'See your fonts on a page.', convert: 'The right file for the job.'

**After**

specimen: 'Make a type sheet.', convert: 'Convert and resize.'

**Before**

Make the work.<br />Let Toolbox finish the files.

**After**

Prepare your files<br />for handoff.

**Before**

Logo packages, color systems, type specimens and image conversion. Try the examples below.

**After**

Package logos, export palettes, make type sheets, and convert images. Try each tool below.

**Before**

label={`About ${active.name}`}

**After**

label={`${active.name} guide`}

**Before**

Same tools.<br />Your workflow.

**After**

Automate<br />your exports.

**Before**

Use the app, run a command, or connect over MCP. Scripts and AI assistants use the same export engine as the app.

**After**

Use the same tools from your terminal or an AI assistant through MCP. Inspect files, preview exports, and reopen saved work without opening the app.

**Before**

Download Toolbox for your computer. SHA-256 checksums are available on the releases page if you want to verify your download.

**After**

Choose the build for your computer below. The releases page includes SHA-256 checksums to verify the downloaded file.

## src/routes/toolbox/[tool]/+page.svelte

**Before**

Run this example in a terminal after setting up the toolbox command. Replace the sample inputs with your own. The CLI and MCP use the app’s export engine with the options listed below.

**After**

Set up the toolbox command using the linked guide, then run this example with your own inputs. The options below work with both the CLI and MCP.

## src/routes/toolbox/agents/+page.svelte

**Before**

The installed app includes a command-line interface (CLI) for scripts and an MCP server for AI assistants. MCP, the Model Context Protocol, lets an assistant discover and run the tools. Both use the app’s export engine without showing a window.

**After**

Toolbox includes a command-line interface (CLI) and an MCP server. Use the CLI in your terminal or scripts. MCP (Model Context Protocol) lets an AI assistant find and run the tools. Both work without opening an app window.

**Before**

Install Toolbox first. The paths above show where to find its executable. The examples below use toolbox as the command; you can substitute the full path. On macOS, the link shown here makes that shortcut available from your terminal. Run the executable directly: the macOS open command detaches it, so you won’t see the results in your terminal.

**After**

Install Toolbox first. You can run it using the full executable path shown above, or set up the toolbox shortcut used in these examples. On macOS, run the command here to create that shortcut. Run the executable directly rather than using the macOS open command, which won’t return results to your terminal.

**Before**

Choose a tool, supply its inputs and options, and set an output folder. Running toolbox with no arguments opens the desktop app. All four tools support the same export settings through the app, CLI, and MCP, including print colors, per-variation settings, and custom font roles.

**After**

Choose a tool, add your inputs and options, and set an output folder. Running toolbox without arguments opens the app. The CLI and MCP support all four tools and the same export settings, including print colors, settings for individual logo variations, and custom font roles.

**Before**

Values without a flag become the main input: file paths for convert and lockup, hex colors for palette.

**After**

Pass file paths directly to convert and lockup, or hex colors to palette. You don’t need a flag for these inputs.

**Before**

Export and preview require --out. Toolbox creates a new subfolder inside that destination and leaves existing files in place. Inspection, font discovery, and library queries need no destination.

**After**

Use --out for exports and previews. Toolbox creates a new folder inside that destination, leaving existing files untouched. Inspecting files, listing fonts, and reading library records don’t need an output folder.

**Before**

New in 1.1.0: assign print colors, set options for individual logo variations, name palette swatches, sample images, and define your own font roles. Use inspect to find source colors and fonts to list installed families and faces.

**After**

You can assign print colors, adjust individual logo variations, name swatches, sample images, and define font roles. These options are available from version 1.1.0. Use inspect to find the colors in your artwork and fonts to list installed font families and styles.

**Before**

Use --action inspect to see settings and planned files without writing anything. Convert also measures output sizes; Palette returns previews of its generated code. Use --action preview with --out to write previews you can open.

**After**

Use --action inspect to check settings and see which files will be exported. It doesn’t write any files. Convert also reports output sizes, and Palette returns a preview of the generated code. To save previews you can open, use --action preview with --out.

**Before**

Add --save to an export to make it available in the app’s library. The result includes a savedID. Replace RECORD_ID in these examples with that value to reopen the work. Explicit options override saved settings.

**After**

Add --save when exporting to keep the settings in the app’s library. The result includes a savedID; use that value in place of RECORD_ID to reopen the work. Any options you pass with the new command override the saved settings.

**Before**

The options</h2>

**After**

Options</h2>

**Before**

Supported flags and their defaults are listed below. Run toolbox &lt;tool&gt; --help for the options in your installed version, or toolbox list for their JSON schemas.

**After**

The tables below list supported flags and defaults. To check your installed version, run toolbox &lt;tool&gt; --help. Use toolbox list to get the option schemas as JSON.

**Before**

Run toolbox list to get the full tool catalog as JSON, including descriptions, argument schemas, and examples. Use toolbox describe followed by a tool name to inspect just that tool.

**After**

Run toolbox list for a JSON catalog of all four tools, with descriptions, argument schemas, and examples. Use toolbox describe followed by a tool name for a single tool.

**Before**

Pass a JSON object with the tool name and its arguments to --run. Toolbox checks the arguments, runs the job, and returns JSON with the output folder, file names, and warnings. A successful job exits with code 0. A failed job exits with code 1 and includes an error message. Replace the example paths with your own. The examples use macOS paths and shell quoting; adjust both for your system.

**After**

Pass the tool name and arguments to --run as a JSON object. Toolbox returns the output folder, file names, and any warnings. Successful jobs exit with code 0; failed jobs exit with code 1 and an error message. Replace the example paths with your own and adjust the macOS paths and shell quoting for your system.

**Before**

Start Toolbox with --mcp to expose the four tools to an MCP client over standard input and output. Add the example server configuration to your client’s MCP settings, using the executable path for your platform. For Claude Code, the project configuration file is .mcp.json. Protocol messages use stdout; logs use stderr.

**After**

To connect an AI assistant, add the server configuration shown here to its MCP settings. Use the executable path for your platform. The --mcp flag starts Toolbox’s server over standard input and output. Claude Code reads project settings from .mcp.json. Protocol messages go to stdout and logs go to stderr.

## src/routes/og/[id]/+page.svelte

**Before**

Make the work.<br />Let Toolbox finish the files.

**After**

Prepare your files<br />for handoff.

**Before**

About {t.name} <Arrow />

**After**

{t.name} guide <Arrow />

## src/lib/components/ContactForm.svelte

**Before**

The mail didn’t go through. Try again, or email studio@timothyali.com.

**After**

Your message didn’t send. Try again, or email studio@timothyali.com.

## src/routes/admin/login/+page.svelte

**Before**

We couldn’t sign you in. Check your email address and try again in a minute, or request a fresh link if yours has expired.

**After**

Couldn’t sign you in. Check your email address and try again in a minute. If your link has expired, request a new one.
