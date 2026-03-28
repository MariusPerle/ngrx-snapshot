# Ngrx Snapshot
[![Maintenance](https://img.shields.io/badge/Maintained%3F-no-red.svg)](https://bitbucket.org/lbesson/ansi-colors)

The easy way to get snapshots of [Ngrx Store](https://ngrx.io/) to use with [Devtools](https://github.com/reduxjs/redux-devtools).

[Learn more](projects/ngrx-snapshot/README.md)

# This is deprecated
This project is no longer maintained. Feel free to fork and use as you see fit.

## Necessary updates
- update to your angular version, there are some breaking changes to newest versions of angular.
- update ngrx dependencies
- update rxjs dependencies, as of writing this a major version of rxjs is incoming.
- remove zone.js dependency it's currently only required for testing proposes (fakeAsync)
- change testing framework to vitest since jasmine is no recommended by angular team and vitest is the recommended alternative by them.

## Why is this deprecated?
This project was created as a side project to learn more about ngrx and angular. 
I have since moved on to other projects. I recently identified some necessary updates. 
Making these updates would take more time than to rewrite this project from scratch with the latest versions of angular and ngrx. I have no plans to do this in the near future, but if you want to do it, feel free to fork and use as you see fit.
