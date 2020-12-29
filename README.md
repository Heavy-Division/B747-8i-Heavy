# B747-8i Heavy

## Features Overview

* ### FMC
    * #### VNAV
        * CLB Speed Restriction implemented
    * #### MISC
        * Departure page reworked
* ### EICAS
    *  Doors synoptic page
    *  Electrical synoptic page
* ### MFD / ND
    *  Altitude Arc
    *  Waypoint symbol changed to classic boeing star
* ### IRS
    * IRS implemented
    * IRS L, C and R are fully independent
    * IRS align time can be set to INSTANT, FAST or NORMAL through Heavy menu
    * IRS can be instantly aligned through Heavy menu
* ### MISC
    * Payload Manager
    * Sim Rate manager

# Special functions

## Payload Manager

Payload manager automatically adjust payload and fuel to try to fit selected Center of Gravity.

<p align="center">
<img src="https://user-images.githubusercontent.com/43503767/103153618-15b65400-4792-11eb-897e-a25f861b4940.png" width="300" height="250"><img src="https://user-images.githubusercontent.com/43503767/103153619-15b65400-4792-11eb-9f08-e139b456dc25.png" width="300" height="250"><img src="https://user-images.githubusercontent.com/43503767/103153620-15b65400-4792-11eb-9ab9-83bebf888368.png" width="300" height="250"><img src="https://user-images.githubusercontent.com/43503767/103153616-14852700-4792-11eb-96ba-64d0881fc66c.png" width="300" height="250">
</p>

### Notes:
* Located in MENU -> HEAVY -> PAYLOAD MANAGER
* CG range 0 - 100%
* FOB range 0 - 62868 Gallons
* Payload range 0 - 800000 Pounds
* FOB can be set only in Gallons
* Payload can be set only in Pounds
* Fuel tanks priority groups:
   * LEFT AUX, LEFT MAIN, RIGHT MAIN, RIGHT AUX
   * CENTER
   * LEFT TIP, RIGHT TIP
   * STAB


## Sim Rate Manager (Experimental)
<p align="center">
<img src="https://user-images.githubusercontent.com/43503767/102024591-45795b00-3d93-11eb-82dc-651b436b4563.jpg" width="300" height="250"><img src="https://user-images.githubusercontent.com/43503767/102024592-48744b80-3d93-11eb-9a6d-a50df00ecfcc.jpg" width="300" height="250"><img src="https://user-images.githubusercontent.com/43503767/102024595-4ad6a580-3d93-11eb-82f7-8d48b23e2edc.jpg" width="300" height="250">
</p>

### Notes:
* Located in MENU -> HEAVY -> SIM RATE MANAGER
* Modes:
   * slow down - change sim rate to 1x few miles before TOD or DECEL waypoint
   * pause - pause game few miles before TOD or DECEL waypoint
* Rate Modes:
   * Off - do nothing (do not change sim rate)
   * Linear - Change sim rate to 4x and hold.
   * Normal - Change sim rate to 4x and hold. 5nm before waypoint change sim rate to 2x and hold. 3nm after waypoint change sim rate to 4x and hold.
   * Aggressive - change sim rate to 8x and hold (!!!Do not use this mode now!!! MSFS 747 are not able to hold altitude with rate 8, 16, 32, ... for long time. This mode will be tweaked soon.)
* Unpause button - unpause game when the game is paused by sim rate manager (this is only way how to unpause game)
* Emergency shutdown - Terminates all sim rate manager interventions immediately. During an emergency shutdown is not possible to use FMC for 6 seconds. You will be able to deactivate an emergency shutdown or leave the page without deactivation after 6 seconds.
