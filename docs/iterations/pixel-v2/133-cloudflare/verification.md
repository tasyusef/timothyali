# PX-133 checks on www.timothyali.com (2026-10-29)

```
/                                             200 
/work                                         308 https://www.timothyali.com/work/
/work/parc/                                   200 
/contact/                                     200 
/toolbox/                                     200 
/about                                        308 https://www.timothyali.com/contact/
/work/sonde                                   307 https://www.timothyali.com/work/
/nope                                         404 
/sitemap.xml                                  200 
/resume/Timothy-Ali-Resume.pdf                200 
/download/v1.2.6/Toolbox_1.2.6_aarch64.dmg    302 https://github.com/tasyusef/toolbox/releases/download/v1.2.6/Toolbox_1.2.6_aarch64.dmg
/api/update/darwin/aarch64/1.2.5              302 https://github.com/tasyusef/toolbox/releases/latest/download/latest.json
/admin/                                       303 https://www.timothyali.com/admin/login/
https://timothyali.com/work/parc/?x=1         308 https://www.timothyali.com/work/parc/?x=1
strict-transport-security: max-age=63072000
permissions-policy: camera=(), microphone=(), geolocation=()
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff
x-frame-options: SAMEORIGIN
server: cloudflare
```

Contact form: one test message, POST /api/contact 200, "Sent" shown. Analytics: POST /api/e 204. Admin sign-in: confirmed by Timothy. Worker: 1120 KiB, 249 KiB gzipped, 19 ms startup.
