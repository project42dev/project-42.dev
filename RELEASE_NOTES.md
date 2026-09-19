# Project 42 public site 0.20.1

Updates public About and information pages and operator documentation. The
learner-data page recognizes the API origin in site configuration. The roadmap
reflects shipped account capabilities and separates instructor scripts from video.
The platform quickstart builds content before installing the site.

## Breaking changes

None. Public routes, curriculum, courses and Field Guides are unchanged.

## Migrations

No learner-data migration. Adopt platform 0.117.2 and regenerate deployment facts.

## Known limitations

Reference self-host profiles retain their documented evaluation status. The legal
page remains an owner-accepted review draft; this release does not claim legal approval.

## Rollback

Redeploy the preceding known-good GitHub Pages artifact or restore the prior
platform pin and configuration, regenerate facts and rebuild. No learner data changes.
