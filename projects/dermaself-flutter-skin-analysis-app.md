# Dermaself Flutter Skin Analysis App

> Flutter mobile app case study for a guided cosmetic skin-analysis flow with Firebase-backed account, intake, photo capture, and results screens.

## Summary
Dermaself is a sanitized mobile case study from the local Mac project scan. The app is organized as a native Flutter experience for Android and iOS, with a guided path from account setup through onboarding, questionnaire intake, selfie/device photo capture, analysis results, and home navigation. The public portfolio summary intentionally avoids medical claims and private repository links; the engineering signal is the mobile architecture, Firebase integration, and release-inference work around a camera-heavy analysis workflow.

## Project Link
https://zack-dev-cm.github.io/projects/dermaself-flutter-skin-analysis-app.md

## Key Features
- Structures the app into clean feature modules for auth, onboarding, questionnaire, photo capture, device capture, analysis, and home
- Uses Firebase services for account state, database records, image storage, analytics, messaging, and serverless extension points
- Builds a guided capture-to-results UX for camera-heavy cosmetic analysis without presenting the portfolio entry as a medical diagnostic claim
- Includes release-inference work for tiled wrinkle/skin-texture processing in the mobile delivery path

## Tech Stack
- Flutter
- Dart
- Firebase
- Riverpod
- GoRouter
- Mobile CV
- iOS
- Android

## Benchmarks & Analytics
- Native targets: 2 (Android and iOS app structure in local source)
- Feature modules: 7 (auth, onboarding, questionnaire, photo capture, device capture, analysis, home)
- Latest local commit: 2026-05-05 (local Mac repo history reviewed before portfolio add)
