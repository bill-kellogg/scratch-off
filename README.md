This is a scratch off UI that I built using Canvas. The original application was for a marketing campaign where the user would scratch off an image to reveal 1 of 3 possible coupon offers. The production version saved a localStorage key so that when the user refreshed, they would see the same offer again already revealed (yes, it was easily hackable by switching browsers or clearing the local storage).

I've swapped out the creative assets here to just reveal 1 of 3 possible optical illusions, but you should be able to get the idea. The most difficult/time-consuming part of this build was actually getting the timing and path for the into animation to look right!

This repo uses live-server which can be installed globally:
```
npm i live-server -g
```

To start the local server:
```
npm run start
```