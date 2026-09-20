# Toolbox 1.1.1 release

The current download version is 1.1.1. All six website installer filenames derive from APP.version. The corresponding download-click browser check uses the new filename; historical analytics fixtures retain their historical versions.

The release was published on September 20 after the local Apple credential profile was restored. Both macOS architectures are signed, notarized and stapled; codesign, stapler and Gatekeeper checks pass. Both packaged executables successfully exported palettes. DMG integrity checks pass. Linux AppImage architectures and deb control/data contents were verified. All eight downloads and SHA256SUMS match their remote GitHub asset digests.

`verification.json` records local site checks, private app CI, notarization submission IDs and publication status. App verification passed 219 tests, both golden export fixtures and 34 CLI/MCP integration checks. Site checks report zero diagnostics, 24 tests pass, and the production build renders all six installer URLs with version 1.1.1.

Release: https://github.com/tasyusef/toolbox/releases/tag/v1.1.1
Website: https://www.timothyali.com/toolbox/

Production deployment `AnRQUVJK9EBpPh82wyqE13WCeZji` succeeded for `c80cc59`. The live Toolbox page returns HTTP 200, displays 1.1.1, and exposes exactly the six expected installer links. All eight release downloads and the checksum manifest return HTTP 200 with the expected sizes.
