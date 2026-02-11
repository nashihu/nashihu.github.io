.PHONY: ipa apk release
APP_ID := $(shell sed -n '/"mobilesdk_app_id"/{s/.*"mobilesdk_app_id": "\(.*\)".*/\1/p;q;}' android/app/google-services.json)
OUTPUT_APK = app-release.apk
filename ?= $(OUTPUT_APK)
OUTPUT_PATH = build/app/outputs/flutter-apk/

apk:
	@echo "\nbuilding apk $(ENV) for non emulator devices \n"

	@echo "--commented build.gradle line 61, enabled line 60"
	@sed -i '' 's/\/\/        ndk.abiFilters/        ndk.abiFilters/g' android/app/build.gradle
	@sed -i '' 's/        ndk.abiFilters .x86.,.*armeabi-v7a./\/\/        ndk.abiFilters '\''x86'\'','\''x86_64'\'','\''arm64-v8a'\'', '\''armeabi-v7a'\''/g' android/app/build.gradle

	@flutter build apk --dart-define=env=$(ENV)

	@echo "--switch back to original\n"
	@sed -i '' 's/^        ndk.abiFilters '\''armeabi-v7a'\''/\/\/        ndk.abiFilters '\''armeabi-v7a'\''/g' android/app/build.gradle
	@sed -i '' 's/^\/\/        ndk.abiFilters '\''x86'\'','\''x86_64'\'','\''arm64-v8a'\'', '\''armeabi-v7a'\''/        ndk.abiFilters '\''x86'\'','\''x86_64'\'','\''arm64-v8a'\'', '\''armeabi-v7a'\''/g' android/app/build.gradle

	@open $(OUTPUT_PATH)
	@mv $(OUTPUT_PATH)$(OUTPUT_APK) $(OUTPUT_PATH)$(filename) #rename file

apk env: ENV=dev

dev:
	@make apk

sta:
	@make apk ENV=sta

prod:
	@make apk ENV=prod-chuck

ps: # ps = playstore
	@make apk ENV=prod

release:
	@echo "building appbundle file for env $(ENV) using app_id = $(APP_ID)"
	@flutter build appbundle --release --obfuscate --split-debug-info=sym --dart-define=env=$(ENV)
	@firebase crashlytics:symbols:upload --app=$(APP_ID) sym/app.android-arm64.symbols
	@firebase crashlytics:symbols:upload --app=$(APP_ID) sym/app.android-arm.symbols
	@firebase crashlytics:symbols:upload --app=$(APP_ID) sym/app.android-x64.symbols

release env: ENV=prod-chuck

beta:
	@make release

publish:
	@make release ENV=prod

ipa:
	@echo "building ipa file for env $(ENV)"
	@flutter build ipa --export-options-plist=ExportOptions.plist --dart-define=env=$(ENV)
	@open /Users/ahmadnashihuddien/Documents/work/flutter/sibolangit/build/ios/ipa

ipa arg: ENV=dev

ipasta:
	@make ipa ENV=sta

ipabeta:
	@make ipa ENV=prod-chuck

submit:
	@make ipa ENV=prod

