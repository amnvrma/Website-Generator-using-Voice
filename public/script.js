
navigator.mediaDevices.getUserMedia({audio : true}).then(stream => {

    if(!MediaRecorder.isTypeSupported('audio/webm')) {
        return alert('Browser not supported');
    }

    let sockett = io();
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm'});
    sockett.emit("getAPI")
    sockett.on("getAPI",(API_KEY,URL) =>{
        const socket = new WebSocket(URL, [
        'token',
        API_KEY
    ]);

    socket.onopen = () => {
        console.log({event: 'onopen'});

        document.querySelector('#status').textContent = 'Connected';

        mediaRecorder.addEventListener('dataavailable', async (event) => {
            if(event.data.size > 0 && socket.readyState == 1) {
                socket.send(event.data);
            }
        });
        mediaRecorder.start(300)
    }
    socket.onmessage = message => {
        console.log({event: 'onmessage'});

        const actions = ['add','delete','modify','structure'];
        const elements = ['button','title','paragraph','input'];

        const received  = JSON.parse(message.data);
        console.dir(received.channel.alternatives);
        const transcript = received.channel.alternatives[0].transcript;
        console.log(transcript)

        if(transcript && received.is_final){
            let body = document.querySelector('body');
            if(transcript.includes("add") || transcript.includes("and") || transcript.includes("at") || transcript.includes("had")){
                
                if(transcript.includes("title")){
                    
                    let child = document.createElement("h1");
                    
                    child.textContent = transcript.substring(transcript.lastIndexOf("name")+4);
                   
                    body.appendChild(child);
                }

                else if(transcript.includes("submit")){
                    let child = document.createElement("button");
                    child.style.width = "70px";
                    child.style.height = "20px";
                    child.setAttribute('id', "submit");
                    child.setAttribute('type', "submit");
                    
                   
                    child.textContent = "Submit";
                    body.appendChild(child);
                }

                
                else if(transcript.includes("button")){
                    
                    let child = document.createElement("button");
                    child.style.width = "70px";
                    child.style.height = "20px";
                    child.setAttribute('id', transcript.substring(transcript.lastIndexOf(' ')+1 ));
                    child.textContent = transcript.substring(transcript.lastIndexOf(' '));
                    
                    body.appendChild(child);
                }
                else if(transcript.includes("input")){
                    let child = document.createElement("input");
                    child.style.width = "125px";
                    child.style.height = "20px";
                   
                    body.appendChild(child);
                }
                else if(transcript.includes("para")){
                    let child = document.createElement("p");
                    child.textContent =transcript.substring(transcript.indexOf('name')+5 );
                   
                    body.appendChild(child);
                }
                else if(transcript.includes("line") || transcript.includes("new")){
                    let child = document.createElement("br");
                    
                    
                    body.appendChild(child);
                }
            }


            else if(transcript.includes("delete")){
                if(transcript.includes("everything")){
                    
                    while (body.firstChild) {
                        body.removeChild(body.firstChild);
                    }
                }
                else body.removeChild(document.querySelector(`#${transcript.substring(transcript.lastIndexOf('name')+5 )}`));
            }

            else if(transcript.includes("give")){
                let child = document.querySelector(`#${transcript.substring(transcript.indexOf('name' )+ 5, transcript.indexOf('color')-1 )}`)
                console.log(child) // give a button name input color blue
                child.style.backgroundColor = `${transcript.substring(transcript.lastIndexOf(' ')+1 )}`
            }
            // document.querySelector('#test').textContent += transcript + ' ';
        }
    }
    socket.onclose = () => {
        console.log({event: 'onclose'});
    }
    socket.onerror = () => {
        console.log({ event: 'onerror', error});
    }
    


    })
    
 
    
});

 
