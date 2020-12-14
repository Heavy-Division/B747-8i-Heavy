# B747-8i Heavy

## Features Overview

* ### FMC
    * #### VNAV
        * CLB Speed Restriction implemented
* ### MFD
    *  Altitude Arc
    
## Special functions

### Sim Rate Manager (Experimental)
<p align="center">
<img src="https://user-images.githubusercontent.com/43503767/102024591-45795b00-3d93-11eb-82dc-651b436b4563.jpg" width="300" height="250"><img src="https://user-images.githubusercontent.com/43503767/102024592-48744b80-3d93-11eb-9a6d-a50df00ecfcc.jpg" width="300" height="250"><img src="https://user-images.githubusercontent.com/43503767/102024595-4ad6a580-3d93-11eb-82f7-8d48b23e2edc.jpg" width="300" height="250">
</p>

## Modes

* ### Off - do nothing
* ### Linear - Change sim rate to 4x and hold.
* ### Normal - Change sim rate to 4x and hold. 5nm before waypoint change sim rate to 2x and hold. 3nm after waypoint change sim rate to 4x and hold.
* ### Aggressive - change sim rate to 8x and hold (!!!Do not use this mode now!!! MSFS 747 are not able to hold altitude with rate 8, 16, 32, ... for long time. This mode will be tweaked soon.) 

### Sim rate manager will automatically change sim rate to 1x few miles before TOD or DECEL waypoint.

## Emergency shutdown
### Terminates all sim rate manager interventions immediately. During an emergency shutdown is not possible to use FMC for 6 seconds. You will be able to deactivate an emergency shutdown or leave the page without deactivation after 6 seconds.

---
