# Changelog

## [1.1.0] - 2022-03-26

### Changed

Commands:
_ Improve replied error message for user commands.
_ Check whether index is an integer or not in profile/activate,
profile/remove and profile/update commands.
_ Show hint if all profiles are removed after profile/remove command.
_ Allow using space as separator in option cards in profile/update command. \* Detect and remove duplicated players in profile/arrange command.

Chore:
_ Refactor error handling mechanism on command executing.
_ Update dependencies.

### Added

Chore:
_ Add more tests.
_ Add lint & build check on PRs. \* Add lint rules for and clean up import paths.
