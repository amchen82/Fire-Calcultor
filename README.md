# Fire Calculator

An offline Expo + React Native app that projects an investment balance once per year using annual compounding and plots yearly end balance and contributions with labeled axes, legend, a touch tooltip, and a responsive chart that respects iOS safe areas.


## Edge Cases
- Negative or zero annual return rate.
- Immediate withdrawal when `withdrawStartYear` is 0.
- Very large withdrawal percent that can quickly drain the balance.

No authentication or networking is included in this version.
