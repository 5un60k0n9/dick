const LineAPI = require(&apos;./api&apos;);<br>
const { Message, OpType, Location } = require(&apos;../curve-thrift/line_types&apos;);<br>
let exec = require(&apos;child_process&apos;).exec;<br>
<br>
const myBot = [&apos;u03e28057cac4dfaccafaa8798dcd9d33&apos;,&apos;u96b72a6a2b23143a9959aca9114ee347&apos;,&apos;u1b6b7339ab719a4294001eb74e410cb3&apos;];<br>
var vx = {};var midnornama = &quot;&quot;;var pesane = &quot;&quot;;//DO NOT CHANGE THIS<br>
var banList = [&apos;u02a0665c44d3fa83e0864ef91ea76f8d&apos;];//Banned list<br>
var waitMsg = &quot;no&quot;; //DO NOT CHANGE THIS<br>
var msgText = &quot;Bro.... ini tes, jangan dibales !&quot;;<br>
<br>
function isAdminOrBot(param) {<br>
&nbsp;&nbsp;&nbsp; return myBot.includes(param);<br>
}<br>
<br>
function isBanned(banList, param) {<br>
&nbsp;&nbsp;&nbsp; return banList.includes(param);<br>
}<br>
<br>
class LINE extends LineAPI {<br>
&nbsp;&nbsp;&nbsp; constructor() {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; super();<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; this.receiverID = &apos;&apos;;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; this.checkReader = [];<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; this.stateStatus = {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; cancel: 0,<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; kick: 1,<br>
			salam: 1,<br>
			mute: 0<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }<br>
		this.keyhelp = &quot;\n\<br>
====================\n\<br>
# Keyword List\n\n\<br>
▪ !ban *ADMIN*\n\<br>
▪ !banlist\n\<br>
▪ !botleft *ADMIN*\n\<br>
▪ !cekid\n\<br>
▪ !gURL\n\<br>
▪ !halo\n\<br>
▪ !kepo\n\<br>
▪ !key\n\<br>
▪ !kickall *ADMIN*\n\<br>
▪ !kickme\n\<br>
▪ !msg\n\<br>
▪ !mute *ADMIN*\n\<br>
▪ !myid\n\<br>
▪ !sendcontact\n\<br>
▪ !speed\n\<br>
▪ !tagall *ADMIN*\n\<br>
▪ !unmute *ADMIN*\n\<br>
\n\n# Gunakan bot dengan bijak ^_^&quot;;<br>
&nbsp;&nbsp;&nbsp; }<br>
<br>
&nbsp;&nbsp;&nbsp; getOprationType(operations) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; for (let key in OpType) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; if(operations.type == OpType[key]) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; if(key !== &apos;NOTIFIED_UPDATE_PROFILE&apos;) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; console.info(`[* ${operations.type} ] ${key} `);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }<br>
&nbsp;&nbsp;&nbsp; }<br>
<br>
&nbsp;&nbsp;&nbsp; poll(operation) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; if(operation.type == 25 || operation.type == 26) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; const txt = (operation.message.text !== &apos;&apos; &amp;&amp; operation.message.text != null ) ? operation.message.text : &apos;&apos; ;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; let message = new Message(operation.message);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; this.receiverID = message.to = (operation.message.to === myBot[0]) ? operation.message.from : operation.message.to ;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Object.assign(message,{ ct: operation.createdTime.toString() });<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; if(waitMsg == &quot;yes&quot; &amp;&amp; operation.message.from == vx[0] &amp;&amp; this.stateStatus.mute != 1){<br>
				this.textMessage(txt,message,message.text)<br>
			}else if(this.stateStatus.mute != 1){this.textMessage(txt,message);<br>
			}else if(txt == &quot;!unmute&quot; &amp;&amp; isAdminOrBot(operation.message.from) &amp;&amp; this.stateStatus.mute == 1){<br>
			&nbsp;&nbsp;&nbsp; this.stateStatus.mute = 0;<br>
			&nbsp;&nbsp;&nbsp; this._sendMessage(message,&quot;ヽ(^。^)ノ&quot;)<br>
		&nbsp;&nbsp;&nbsp; }else{console.info(&quot;muted&quot;);}<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; if(operation.type == 13 &amp;&amp; this.stateStatus.cancel == 1) {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; this.cancelAll(operation.param1);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; }<br>
		<br>
		if(operation.type == 43 || operation.type == 41 || operation.type == 24 || operation.type == 15 || operation.type == 21){console.info(operation);}<br>
		<br>
		if(operation.type == 16 &amp;&amp; this.stateStatus.salam == 1){//join group<br>
			let halo = new Message();<br>
			halo.to = operation.param1;<br>
			halo.text = &quot;Halo, Salam Kenal ^_^ !&quot;;<br>
			this._client.sendMessage(0, halo);<br>
		}<br>
		<br>
		if(operation.type == 17 &amp;&amp; this.stateStatus.salam == 1 &amp;&amp; isAdminOrBot(operation.param2)) {//ada yang join<br>
		&nbsp;&nbsp;&nbsp; let halobos = new Message();<br>
			halobos.to = operation.param1;<br>
			halobos.toType = 2;<br>
			halobos.text = &quot;Halo bos !, selamat datang di group ini bos !&quot;;<br>
			this._client.sendMessage(0, halobos);<br>
		}else if(operation.type == 17 &amp;&amp; this.stateStatus.salam == 1){//ada yang join<br>
			let seq = new Message();<br>
			seq.to = operation.param1;<br>
			//halo.siapa = operation.param2;<br>
			this.textMessage(&quot;0101&quot;,seq,operation.param2);<br>
			//this._client.sendMessage(0, halo);<br>
		}<br>
		<br>
		if(operation.type == 15 &amp;&amp; isAdminOrBot(operation.param2)) {//ada yang leave<br>
		&nbsp;&nbsp;&nbsp; let babay = new Message();<br>
			babay.to = operation.param1;<br>
			babay.toType = 2;<br>
			babay.text = &quot;Ada apa bos ? kok leave ?&quot;;<br>
			this._invite(operation.param1,[operation.param2]);<br>
			this._client.sendMessage(0, babay);<br>
		}else if(operation.type == 15 &amp;&amp; !isAdminOrBot(operation.param2)){<br>
			let seq = new Message();<br>
			seq.to = operation.param1;<br>
			this.textMessage(&quot;0102&quot;,seq,operation.param2);<br>
		}<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; if(operation.type == 19) { //ada kick<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; // op1 = group nya<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 