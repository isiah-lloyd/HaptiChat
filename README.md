# HaptiChat
A Node.js and socket.io webapp that sends vibrations to all connected clients on a button press. I made this to learn real time communcation in the web browser using WebSockets. 

# Features:
* Synchronized vibrations!
* Stats!
* Archaic data store to a file!

# How to Run: 
    $ git clone https://github.com/isiah-lloyd/HaptiChat.git
    $ cd HaptiChat
    $ npm install
    $ node index.js
On run HaptiChat will create/read from button_presses.txt to store the number of times the button has been pressed. The console will output info such as a user connecting/disconnecting or the button being pressed. The button presses will be saved to the file every three minutes or on exit. 
