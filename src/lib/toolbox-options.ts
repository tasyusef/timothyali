// Generated from Toolbox’s shared tool catalog. Run tools/toolbox/sync-options.mjs to update.
import type { Param } from "./toolbox";
export const machineParams: Record<string, Param[]> = {
  "convert": [
    {
      "name": "action",
      "type": "string",
      "choices": [
        "export",
        "inspect",
        "preview",
        "library-list",
        "library-get",
        "library-remove"
      ],
      "default": "export",
      "description": "Export files, inspect settings and the output plan without writing, render previews, or manage saved work. Convert previews write the selected output formats; other tools write PNG. Specimen also lists fonts."
    },
    {
      "name": "saved",
      "type": "string",
      "description": "Saved-work ID to reopen. Explicit options override its settings. Required for library-get and library-remove."
    },
    {
      "name": "save",
      "type": "boolean",
      "default": false,
      "description": "Save the completed export to the app library, or update the reopened record. Defaults to false for scripts."
    },
    {
      "name": "input",
      "type": "string[]",
      "description": "Paths of the image files to convert.",
      "required": true,
      "primary": true
    },
    {
      "name": "formats",
      "type": "string[]",
      "description": "Output formats. Every input is written in each one.",
      "choices": [
        "png",
        "jpeg",
        "webp",
        "tiff",
        "pdf"
      ],
      "default": [
        "png"
      ]
    },
    {
      "name": "compression",
      "type": "number",
      "description": "How hard to compress, 0 to 100. 0 uses the highest encoder quality; conversion still re-encodes the image. 100 applies the strongest compression offered. Applies to JPEG, WebP and PDF; PNG and TIFF are lossless and ignore it.",
      "default": 10,
      "min": 0,
      "max": 100
    },
    {
      "name": "originalSize",
      "type": "boolean",
      "default": false,
      "description": "Clear a saved resize limit and keep original dimensions. Cannot be combined with longestEdge."
    },
    {
      "name": "longestEdge",
      "type": "number",
      "description": "Cap the longest side, in pixels, keeping the aspect ratio. Omit to keep each image at its own size. Images already smaller are left alone."
    },
    {
      "name": "background",
      "type": "string",
      "description": "Fill behind transparency: 'none' keeps it wherever the format allows, or give a hex colour like '#ffffff'. JPEG and PDF have no transparency and fill with white when this is 'none'.",
      "default": "none"
    },
    {
      "name": "out",
      "type": "string",
      "description": "Folder to write into. A fresh subfolder is created inside it, so nothing is overwritten.",
      "required": true
    }
  ],
  "lockup": [
    {
      "name": "action",
      "type": "string",
      "choices": [
        "export",
        "inspect",
        "preview",
        "library-list",
        "library-get",
        "library-remove"
      ],
      "default": "export",
      "description": "Export files, inspect settings and the output plan without writing, render previews, or manage saved work. Convert previews write the selected output formats; other tools write PNG. Specimen also lists fonts."
    },
    {
      "name": "saved",
      "type": "string",
      "description": "Saved-work ID to reopen. Explicit options override its settings. Required for library-get and library-remove."
    },
    {
      "name": "save",
      "type": "boolean",
      "default": false,
      "description": "Save the completed export to the app library, or update the reopened record. Defaults to false for scripts."
    },
    {
      "name": "name",
      "type": "string",
      "description": "Package name used in the folder and file names."
    },
    {
      "name": "variations",
      "type": "json",
      "description": "Per-input overrides as JSON: [{\"index\":0,\"name\":\"Horizontal\",\"padding\":0.1,\"social\":true,\"socialPadding\":0.12}]. Index is zero-based in input order."
    },
    {
      "name": "palette",
      "type": "json",
      "description": "Color overrides as JSON: [{\"sourceHex\":\"#D32F05\",\"hex\":\"#FF4400\",\"cmyk\":[0,73,100,0],\"pantone\":\"172 C\"}]. Inspect first to find sourceHex values. CMYK is in percent."
    },
    {
      "name": "padVectors",
      "type": "boolean",
      "default": false,
      "description": "Apply variation padding to SVG, PDF, and EPS as well as raster files."
    },
    {
      "name": "socialPadding",
      "type": "number",
      "min": 0,
      "max": 0.25,
      "default": 0.12,
      "description": "Padding for square social versions; per-variation settings override this value."
    },
    {
      "name": "previewDark",
      "type": "boolean",
      "default": false,
      "description": "Use a dark plate in PNG previews and library thumbnails."
    },
    {
      "name": "input",
      "type": "string[]",
      "description": "Paths of the logo SVGs, one per variation (horizontal, stacked, mark).",
      "required": true,
      "primary": true
    },
    {
      "name": "web",
      "type": "string[]",
      "description": "Web file types to include. Pass an empty array to skip web output.",
      "choices": [
        "jpeg",
        "png",
        "svg"
      ],
      "default": [
        "jpeg",
        "png",
        "svg"
      ]
    },
    {
      "name": "print",
      "type": "string[]",
      "description": "Print file types to include. Pass an empty array to skip print output.",
      "choices": [
        "eps",
        "jpeg",
        "pdf"
      ],
      "default": [
        "eps",
        "jpeg",
        "pdf"
      ]
    },
    {
      "name": "treatments",
      "type": "string[]",
      "description": "Colourways to build.",
      "choices": [
        "color",
        "black",
        "white"
      ],
      "default": [
        "color",
        "black",
        "white"
      ]
    },
    {
      "name": "sizes",
      "type": "string[]",
      "description": "Raster sizes: large is 3000px, medium 1500px, small 600px on the long edge.",
      "choices": [
        "large",
        "medium",
        "small"
      ],
      "default": [
        "large",
        "medium",
        "small"
      ]
    },
    {
      "name": "padding",
      "type": "number",
      "description": "Clear space around the mark, as a fraction of the long edge (0 to 0.25).",
      "default": 0,
      "min": 0,
      "max": 0.25
    },
    {
      "name": "social",
      "type": "boolean",
      "description": "Also emit a square profile-picture version of each variation (web only).",
      "default": false
    },
    {
      "name": "out",
      "type": "string",
      "description": "Folder to write into. A fresh subfolder is created inside it, so nothing is overwritten.",
      "required": true
    }
  ],
  "palette": [
    {
      "name": "action",
      "type": "string",
      "choices": [
        "export",
        "inspect",
        "preview",
        "library-list",
        "library-get",
        "library-remove"
      ],
      "default": "export",
      "description": "Export files, inspect settings and the output plan without writing, render previews, or manage saved work. Convert previews write the selected output formats; other tools write PNG. Specimen also lists fonts."
    },
    {
      "name": "saved",
      "type": "string",
      "description": "Saved-work ID to reopen. Explicit options override its settings. Required for library-get and library-remove."
    },
    {
      "name": "save",
      "type": "boolean",
      "default": false,
      "description": "Save the completed export to the app library, or update the reopened record. Defaults to false for scripts."
    },
    {
      "name": "entries",
      "type": "json",
      "description": "Ordered swatches as JSON: [{\"name\":\"Orange\",\"hex\":\"#D32F05\",\"cmyk\":[0,78,98,17],\"pantone\":\"1665 C\"}]. Replaces extracted or saved entries; colors and samples then append."
    },
    {
      "name": "samples",
      "type": "json",
      "description": "Sample image colors at normalized coordinates: [{\"image\":0,\"x\":0.5,\"y\":0.5}]. Image indices come from inspect."
    },
    {
      "name": "extract",
      "type": "boolean",
      "default": true,
      "description": "Add dominant image colors automatically. Disable to select only explicit samples or entries."
    },
    {
      "name": "colors",
      "type": "string[]",
      "description": "Hex colours to include, for example ['#D32F05', '#003A5D'].",
      "primary": true
    },
    {
      "name": "input",
      "type": "string[]",
      "description": "Paths of artwork to pull colours from. SVGs contribute their exact fills; images contribute their dominant colours. Combines with `colors`."
    },
    {
      "name": "name",
      "type": "string",
      "description": "Palette name, used for the file names and the sheet heading.",
      "default": "Palette"
    },
    {
      "name": "outputs",
      "type": "string[]",
      "description": "Which files to write.",
      "choices": [
        "css",
        "tokens",
        "ase",
        "sheet"
      ],
      "default": [
        "css",
        "tokens",
        "ase",
        "sheet"
      ]
    },
    {
      "name": "out",
      "type": "string",
      "description": "Folder to write into. A fresh subfolder is created inside it, so nothing is overwritten.",
      "required": true
    }
  ],
  "specimen": [
    {
      "name": "action",
      "type": "string",
      "choices": [
        "export",
        "inspect",
        "preview",
        "library-list",
        "library-get",
        "library-remove",
        "fonts"
      ],
      "default": "export",
      "description": "Export files, inspect settings and the output plan without writing, render previews, or manage saved work. Convert previews write the selected output formats; other tools write PNG. Specimen also lists fonts."
    },
    {
      "name": "saved",
      "type": "string",
      "description": "Saved-work ID to reopen. Explicit options override its settings. Required for library-get and library-remove."
    },
    {
      "name": "save",
      "type": "boolean",
      "default": false,
      "description": "Save the completed export to the app library, or update the reopened record. Defaults to false for scripts."
    },
    {
      "name": "roles",
      "type": "json",
      "description": "Ordered brand styles as JSON: [{\"label\":\"Display\",\"family\":\"Helvetica\",\"face\":\"Bold\",\"size\":40}]. Replaces the default roles; sizes are in points. Use action fonts for installed names."
    },
    {
      "name": "template",
      "type": "string",
      "description": "'brand' lays out named roles (heading, body, caption); 'classic' shows one family at a range of sizes.",
      "choices": [
        "brand",
        "classic"
      ],
      "default": "brand"
    },
    {
      "name": "title",
      "type": "string",
      "description": "Heading printed on the sheet.",
      "default": "Typography"
    },
    {
      "name": "sample",
      "type": "string",
      "description": "The sentence set in each face.",
      "default": "The quick brown fox jumps over the lazy dog"
    },
    {
      "name": "family",
      "type": "string",
      "description": "Font family for the 'classic' template, for example 'Helvetica'. Ignored by 'brand'."
    },
    {
      "name": "out",
      "type": "string",
      "description": "Folder to write into. A fresh subfolder is created inside it, so nothing is overwritten.",
      "required": true
    }
  ]
};
