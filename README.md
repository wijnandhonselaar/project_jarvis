# Project Jarvis

Jarvis is een domotica systeem op basis van een Node.js server, waarbij door middel van een zelf gecreëerde object-definitie met apparaten en sensoren gecommuniceerd kan worden. Jarvis bevat een zogenaamde rule-engine, een van zijn sterke punten. Het faciliteert ook een simpele methode om nieuwe actuatoren en sensoren aan Jarvis eenvoudig in te stellen binnen het systeem. Jarvis herkent nieuw aangesloten apparaten en geeft hierbij dan de mogelijke opties om deze te configureren. Zo kan een gebruiker zelf voorwaarden instellen waaronder apparaten acties moeten ondernemen.

![ScreenShot](https://github.com/HANICA/project_jarvis/blob/development/screenshot.png)

# Installatie Raspberry Pi

# Inleiding
Voor het project Jarvis is een Raspberry Pi met een 7” touchscreen gebruikt. In deze handleiding is te vinden hoe deze geinstalleerd moet worden. Voor deze handleiding zijn bepaalde onderdelen vereist.
-        Raspberry Pi 2
-        7” touchscreen (officieel van Raspberry Pi foundation)
-        32gb geheugen kaart (Bij kleinere is uitgebreide installatie verplicht!)
-        Wifi adapter (indien geen UTP-kabel)
-        Computer met SD-poort


# Eenvoudige installatie
De installatie van de Raspberry Pi is ook mogelijk met een voor geprogrammeerde image van Raspbian. Deze is ontwikkeld door projectgroep Jarvis.

Download link Raspbian Jarvis
> https://mega.nz/#!61gnzY6I!BBfRfJVd3tJz2U812PaA83nBWDv3tLLfEPh-4CfbmW4

Voer na de download stap 1 uit van de uitgebreide installatie met de image die zojuist gedownload is.
 

# Uitgebreide installatie
Deze uitgebreide installatie is indien de voorgeprogrameerde Raspbian niet werkt of niet beschikbaar is.

# Stap 1
Indien de raspberry nog geen besturingssysteem bezit dient deze geinstalleerd te worden. Download Raspbian Jessy van de Raspberry website en pak deze uit.
Download link Raspbian Jessy
> https://downloads.raspberrypi.org/raspbian_latest

Download link Win32DiskImager
> http://sourceforge.net/projects/win32diskimager/

Doe de SD-kaart in de computer en open win32diskimager.
Selecteer the Raspbian image die eerder gedownload en uitgepakt was.
Selecteer de juiste Drive waarin de SD kaart zit, zodat de image op de juiste SD kaart wordt geschreven.
Selecteer ‘Write’ en wacht tot het voltooid is. Doe nu doe SD kaart in de Raspberry.

# Stap 2
1.Installatie van NodeJS op de Raspberry.

Open de console en voer de volgende commando’s uit.
```
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
```
2.Installatie van Rethinkdb op de Raspberry. Tijdens deze installatie kunnen er veel problemen voordoen, voornamelijk met het geheugen. Begin met het vergroten van de SWAP file. Dit kan gedaan worden door de volgende commando’s uit te voeren.
```
sudo nano /etc/dphys-swapfile
De standard waarde van Raspbian is:
CONF_SWAPSIZE=100
Deze moet veranderd worden in:
CONF_SWAPSIZE=1024
```
3.Na dat je de veranderingen hebt opgeslagen dient de service die de swapfile managet opnieuw opgestart te worden. Dat gebeurt met de volgende commando’s:

```
sudo /etc/init.d/dphys-swapfile stop
sudo /etc/init.d/dphys-swapfile start
```

4.Vanaf dit punt kan de installatie beginnen voor rethinkdb. Voer de volgende commando’s in volgorde uit. PAS OP! De opdracht ‘export CXXFLAGS’ kan meer dan 8 uur duren. De Raspberry mag niet worden afgesloten als deze begonnen is! Mocht deze toch uitgaan kan het zijn dat de installatie fout gaat en helemaal opnieuw begonnen moet worden.

```
wget http://download.rethinkdb.com/dist/rethinkdb-latest.tgz
tar xf rethinkdb-2.0.4.tgz
rm rethinkdb-2.0.4.tgz
cd rethinkdb-*
./configure --with-system-malloc --allow-fetch
export CXXFLAGS="-mfpu=neon-vfpv4 -mcpu=native -march=native -mfloat-abi=hard" | make -j3 ALLOW_WARNINGS=1
sudo make install
```

5.  	Als de installatie is gelukt kan rethinkdb gestart worden door het commando ‘rethinkdb’.

# Stap 3
In stap 3 moet het programma van Github afgehaald worden en op de raspberry gezet worden om te kunnen gebruiken

1.      Ga naar https://github.com/HANICA/project_jarvis/tree/master en download de laatste versie en pak deze uit.
2.      Ga naar de de uitgepakte map en voer het commando ‘node app.js’ uit. Nu start de applicatie op de achtergrond.
3.      Vanaf nu is de applicatie te bereiken op ‘localhost:3321’.


# Stap 4
Om de raspberry optimaal te laten werken is het nodig om Chromium te draaien in kiosk mode. Dit kan doormiddel van de volgende commando’s.
```
sudo apt-get update && apt-get upgrade -y
sudo apt-get install chromium x11-xserver-utils unclutter
```
Na deze installatie moet er nog een bestand worden aangepast. Dit kan door de volgende commando.
```
sudo nano /etc/xdg/lxsession/LXDE/autostart
```
Voeg vervolgens de volgende comments toe aan het bestand.
```
@xset s off
@xset -dpms
@xset s noblank
@chromium --kiosk --incognito localhost:3221
```
Daarna is de installatie klaar!

# Development installatie

Deze installatie is nodig voor de ontwikkelaars die verder gaan werken aan het Jarvis domotica project.

```
run "npm install grunt-cli -g" 
run "npm install bower -g" 
run "bower install" in de public map van het project 
run "grunt development” in de root map van het project 
```
