rm fleetany-mobile-armv7.apk
rm fleetany-mobile-x86.apk
cordova build --release android
jarsigner -tsa http://timestamp.digicert.com -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore fleetany.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk fleetany-key
~/Library/Android/sdk/build-tools/23.0.3/zipalign -v 4 platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk fleetany-mobile-armv7.apk
~/Library/Android/sdk/build-tools/23.0.3/zipalign -v 4 platforms/android/build/outputs/apk/android-x86-release-unsigned.apk fleetany-mobile-x86.apk