/**
 * WebMidi.js v3.0.0-alpha.0
 * A JavaScript library to kickstart your MIDI projects
 * https://webmidijs.org
 *
 * This build was generated on June 4th 2020.
 *
 *
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2020, Jean-Philippe Côté
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

"use strict";Object.defineProperty(exports,"__esModule",{value:!0});class e{constructor(e=!1){this.eventMap={},this.eventsSuspended=1==e}addListener(n,r,s={}){if("string"==typeof n&&n.length<1||n instanceof String&&n.length<1||"string"!=typeof n&&!(n instanceof String)&&n!==e.ANY_EVENT)throw new TypeError("The 'event' parameter must be a string or EventEmitter.ANY_EVENT.");if("function"!=typeof r)throw new TypeError("The callback must be a function.");const a=new t(n,this,r,s);return this.eventMap[n]||(this.eventMap[n]=[]),s.prepend?this.eventMap[n].unshift(a):this.eventMap[n].push(a),a}addOneTimeListener(e,t,n={}){n.remaining=1,this.addListener(e,t,n)}static get ANY_EVENT(){return Symbol.for("Any event")}hasListener(n,r){return void 0===n?!!(this.eventMap[e.ANY_EVENT]&&this.eventMap[e.ANY_EVENT].length>0)||Object.entries(this.eventMap).some(([,e])=>e.length>0):!!(this.eventMap[n]&&this.eventMap[n].length>0)&&(r instanceof t?this.eventMap[n].filter(e=>e===r).length>0:"function"==typeof r?this.eventMap[n].filter(e=>e.callback===r).length>0:null==r)}get eventNames(){return Object.keys(this.eventMap)}getListeners(e){return this.eventMap[e]||[]}suspendEvent(e){this.getListeners(e).forEach(e=>{e.suspended=!0})}unsuspendEvent(e){this.getListeners(e).forEach(e=>{e.suspended=!1})}getListenerCount(e){return this.getListeners(e).length}emit(t,...n){if("string"!=typeof t&&!(t instanceof String))throw new TypeError("The 'event' parameter must be a string.");if(this.eventsSuspended)return;let r=[],s=this.eventMap[e.ANY_EVENT]||[];return this.eventMap[t]&&(s=s.concat(this.eventMap[t])),s.forEach(e=>{if(e.suspended)return;let t=[...n];Array.isArray(e.arguments)&&(t=t.concat(e.arguments)),e.remaining>0&&(r.push(e.callback.apply(e.context,t)),e.count++),--e.remaining<1&&e.remove()}),r}removeListener(e,t,n={}){if(void 0===e)return void(this.eventMap={});if(!this.eventMap[e])return;let r=this.eventMap[e].filter(e=>t&&e.callback!==t||n.remaining&&n.remaining!==e.remaining||n.context&&n.context!==e.context);r.length?this.eventMap[e]=r:delete this.eventMap[e]}async waitFor(e,t={}){return t.duration=parseInt(t.duration),(isNaN(t.duration)||t.duration<=0)&&(t.duration=1/0),new Promise((n,r)=>{let s,a=this.addListener(e,()=>{clearTimeout(s),n()},{remaining:1});t.duration!==1/0&&(s=setTimeout(()=>{a.remove(),r("The duration expired before the event was emitted.")},t.duration))})}get eventCount(){return Object.keys(this.eventMap).length}}class t{constructor(t,n,r,s={}){if("string"!=typeof t&&!(t instanceof String)&&t!==e.ANY_EVENT)throw new TypeError("The 'event' parameter must be a string or EventEmitter.ANY_EVENT.");if(!n)throw new ReferenceError("The 'target' parameter is mandatory.");if("function"!=typeof r)throw new TypeError("The 'callback' must be a function.");void 0===s.arguments||Array.isArray(s.arguments)||(s.arguments=[s.arguments]),(s=Object.assign({context:n,remaining:1/0,arguments:void 0,duration:1/0},s)).duration!==1/0&&setTimeout(()=>this.remove(),s.duration),this.event=t,this.target=n,this.callback=r,this.context=s.context,this.remaining=parseInt(s.remaining)>=1?parseInt(s.remaining):1/0,this.count=0,this.arguments=s.arguments,this.suspended=!1}remove(){this.target.removeListener(this.event,this.callback,{context:this.context,remaining:this.remaining})}}class n extends e{constructor(e,t){super(),this.input=e,this.number=t,this._nrpnBuffer=[],this.nrpnEventsEnabled=!0}destroy(){this.input=null,this.removeListener()}_parseEvent(e){let t=null;e.data[0]!==o.MIDI_SYSTEM_MESSAGES.sysex&&(t=e.data.slice(1));let n={target:this,statusByte:e.data[0],dataBytes:t,data:e.data,timestamp:e.timeStamp,type:"midimessage"};this.emit("midimessage",n),this._parseEventForNrpnMessage(e),this._parseEventForStandardMessages(e)}_parseEventForStandardMessages(e){let t,n,r=e.data[0]>>4;e.data.length>1&&(t=e.data[1],n=e.data.length>2?e.data[2]:void 0);let s={target:this,data:e.data,timestamp:e.timeStamp};r===o.MIDI_CHANNEL_VOICE_MESSAGES.noteoff||r===o.MIDI_CHANNEL_VOICE_MESSAGES.noteon&&0===n?(s.type="noteoff",s.note={number:t,name:o.NOTES[t%12],octave:o.getOctave(t)},s.release=n/127,s.rawRelease=n):r===o.MIDI_CHANNEL_VOICE_MESSAGES.noteon?(s.type="noteon",s.note={number:t,name:o.NOTES[t%12],octave:o.getOctave(t)},s.attack=n/127,s.rawVAttack=n):r===o.MIDI_CHANNEL_VOICE_MESSAGES.keyaftertouch?(s.type="keyaftertouch",s.note={number:t,name:o.NOTES[t%12],octave:o.getOctave(t)},s.value=n/127,s.rawValue=n):r===o.MIDI_CHANNEL_VOICE_MESSAGES.controlchange&&t>=0&&t<=119?(s.type="controlchange",s.controller={number:t,name:this.getCcNameByNumber(t)},s.value=n/127,s.rawValue=n):r===o.MIDI_CHANNEL_VOICE_MESSAGES.channelmode&&t>=120&&t<=127?(s.type="channelmode",s.controller={number:t,name:this.getChannelModeByNumber(t)},s.value=n):r===o.MIDI_CHANNEL_VOICE_MESSAGES.programchange?(s.type="programchange",s.value=t):r===o.MIDI_CHANNEL_VOICE_MESSAGES.channelaftertouch?(s.type="channelaftertouch",s.value=t/127,s.rawValue=t):r===o.MIDI_CHANNEL_VOICE_MESSAGES.pitchbend?(s.type="pitchbend",s.value=((n<<7)+t-8192)/8192,s.rawValue=(n<<7)+t):s.type="unknownmessage",this.emit(s.type,s)}getChannelModeByNumber(e){if(!((e=Math.floor(e))>=120&&status<=127))return!1;for(let t in o.MIDI_CHANNEL_MODE_MESSAGES)if(o.MIDI_CHANNEL_MODE_MESSAGES.hasOwnProperty(t)&&e===o.MIDI_CHANNEL_MODE_MESSAGES[t])return t}_parseEventForNrpnMessage(e){if(!this.nrpnEventsEnabled)return;let t,r,s=e.data[0]>>4,a=1+(15&e.data[0]);if(e.data.length>1&&(t=e.data[1],r=e.data.length>2?e.data[2]:void 0),s!==o.MIDI_CHANNEL_VOICE_MESSAGES.controlchange||!(t>=o.MIDI_NRPN_MESSAGES.increment&&t<=o.MIDI_NRPN_MESSAGES.parammsb||t===o.MIDI_NRPN_MESSAGES.entrymsb||t===o.MIDI_NRPN_MESSAGES.entrylsb))return;let i={target:this,type:"controlchange",data:e.data,timestamp:e.timeStamp,channel:a,controller:{number:t,name:this.getCcNameByNumber(t)},value:r};if(i.controller.number===o.MIDI_NRPN_MESSAGES.parammsb&&i.value!=o.MIDI_NRPN_MESSAGES.nullactiveparameter)this._nrpnBuffer=[],this._nrpnBuffer[0]=i;else if(1===this._nrpnBuffer.length&&i.controller.number===o.MIDI_NRPN_MESSAGES.paramlsb)this._nrpnBuffer.push(i);else if(2!==this._nrpnBuffer.length||i.controller.number!==o.MIDI_NRPN_MESSAGES.increment&&i.controller.number!==o.MIDI_NRPN_MESSAGES.decrement&&i.controller.number!==o.MIDI_NRPN_MESSAGES.entrymsb)if(3===this._nrpnBuffer.length&&this._nrpnBuffer[2].number===o.MIDI_NRPN_MESSAGES.entrymsb&&i.controller.number===o.MIDI_NRPN_MESSAGES.entrylsb)this._nrpnBuffer.push(i);else if(this._nrpnBuffer.length>=3&&this._nrpnBuffer.length<=4&&i.controller.number===o.MIDI_NRPN_MESSAGES.parammsb&&i.value===o.MIDI_NRPN_MESSAGES.nullactiveparameter)this._nrpnBuffer.push(i);else if(this._nrpnBuffer.length>=4&&this._nrpnBuffer.length<=5&&i.controller.number===o.MIDI_NRPN_MESSAGES.paramlsb&&i.value===o.MIDI_NRPN_MESSAGES.nullactiveparameter){this._nrpnBuffer.push(i);let e=[];this._nrpnBuffer.forEach(t=>e.push(t.data));let t=this._nrpnBuffer[0].value<<7|this._nrpnBuffer[1].value,r=this._nrpnBuffer[2].value;6===this._nrpnBuffer.length&&(r=this._nrpnBuffer[2].value<<7|this._nrpnBuffer[3].value);let s="";switch(this._nrpnBuffer[2].controller.number){case o.MIDI_NRPN_MESSAGES.entrymsb:s=n.NRPN_TYPES[0];break;case o.MIDI_NRPN_MESSAGES.increment:s=n.NRPN_TYPES[1];break;case o.MIDI_NRPN_MESSAGES.decrement:s=n.NRPN_TYPES[2];break;default:throw new Error("The NPRN type was unidentifiable.")}this._nrpnBuffer=[];let a={timestamp:i.timestamp,channel:i.channel,type:"nrpn",data:e,controller:{number:t,type:s,name:"Non-Registered Parameter "+t},value:r/65535,rawValue:r};this.emit(a.type,a)}else this._nrpnBuffer=[];else this._nrpnBuffer.push(i)}get nrpnEventsEnabled(){return this._nrpnEventsEnabled}set nrpnEventsEnabled(e){this._nrpnEventsEnabled=!!e}static get NRPN_TYPES(){return["entry","increment","decrement"]}}class r extends e{constructor(e){super(),this._midiInput=e,this.channels=[];for(let e=1;e<=16;e++)this.channels[e]=new n(this,e);this._midiInput.onstatechange=this._onStateChange.bind(this),this._midiInput.onmidimessage=this._onMidiMessage.bind(this)}async destroy(){this.removeListener(),this.channels.forEach(e=>e.destroy()),this.channels=[],this._midiInput.onstatechange=null,await this.close(),this._midiInput=null}_onStateChange(e){let t={timestamp:o.time,target:this};"open"===e.port.connection?(t.type="opened",this.emit("opened",t)):"closed"===e.port.connection&&"connected"===e.port.state?(t.type="closed",this.emit("closed",t)):"closed"===e.port.connection&&"disconnected"===e.port.state?(t.type="disconnected",t.target={connection:e.port.connection,id:e.port.id,manufacturer:e.port.manufacturer,name:e.port.name,state:e.port.state,type:e.port.type},this.emit("disconnected",t)):"pending"===e.port.connection&&"disconnected"===e.port.state||console.warn("This statechange event was not caught: ",e.port.connection,e.port.state)}_onMidiMessage(e){let t=null;e.data[0]!==o.MIDI_SYSTEM_MESSAGES.sysex&&(t=e.data.slice(1));let n={target:this,data:e.data,statusByte:e.data[0],dataBytes:t,timestamp:e.timeStamp,type:"midimessage"};if(this.emit("midimessage",n),e.data[0]<240){let t=1+(15&e.data[0]);this.channels[t]._parseEvent(e)}else e.data[0]<=255&&this._parseEvent(e)}_parseEvent(e){let t=e.data[0];var n={target:this,data:e.data,timestamp:e.timeStamp};t===o.MIDI_SYSTEM_MESSAGES.sysex?n.type="sysex":t===o.MIDI_SYSTEM_MESSAGES.timecode?n.type="timecode":t===o.MIDI_SYSTEM_MESSAGES.songposition?n.type="songposition":t===o.MIDI_SYSTEM_MESSAGES.songselect?(n.type="songselect",n.song=e.data[1]+1):t===o.MIDI_SYSTEM_MESSAGES.tunerequest?n.type="tunerequest":t===o.MIDI_SYSTEM_MESSAGES.clock?n.type="clock":t===o.MIDI_SYSTEM_MESSAGES.start?n.type="start":t===o.MIDI_SYSTEM_MESSAGES.continue?n.type="continue":t===o.MIDI_SYSTEM_MESSAGES.stop?n.type="stop":t===o.MIDI_SYSTEM_MESSAGES.activesensing?n.type="activesensing":t===o.MIDI_SYSTEM_MESSAGES.reset?n.type="reset":n.type="unknownmidimessage",this.emit(n.type,n)}async open(){try{return await this._midiInput.open(),Promise.resolve(this)}catch(e){return Promise.reject(e)}}async close(){return this._midiInput?this._midiInput.close():Promise.resolve()}getCcNameByNumber(e){if(!((e=Math.floor(e))>=0&&e<=119))return!1;for(let t in o.MIDI_CONTROL_CHANGE_MESSAGES)if(o.MIDI_CONTROL_CHANGE_MESSAGES.hasOwnProperty(t)&&e===o.MIDI_CONTROL_CHANGE_MESSAGES[t])return t;return!1}addListener(e,t,n,r){let s=[];return void 0===o.MIDI_CHANNEL_VOICE_MESSAGES[e]?s.push(super.addListener(e,n,r)):o.sanitizeChannels(t).forEach(t=>{s.push(this.channels[t].addListener(e,n,r))}),s}addOneTimeListener(e,t,n,r={}){return r.remaining=1,this.addListener(e,t,n,r)}on(e,t,n,r){return this.addListener(e,t,n,r)}hasListener(e,t,n){return void 0!==o.MIDI_CHANNEL_VOICE_MESSAGES[e]?o.sanitizeChannels(t).every(t=>this.channels[t].hasListener(e,n)):super.hasListener(e,n)}removeListener(e,t,n,r){if(void 0!==o.MIDI_CHANNEL_VOICE_MESSAGES[e])o.sanitizeChannels(t).forEach(t=>{this.channels[t].removeListener(e,n,r)});else{if(null!=e)return super.removeListener(e,n,r);if(null==e)return super.removeListener()}}get name(){return this._midiInput.name}get id(){return this._midiInput.id}get connection(){return this._midiInput.connection}get manufacturer(){return this._midiInput.manufacturer}get state(){return this._midiInput.state}get type(){return this._midiInput.type}get nrpnEventsEnabled(){return console.warn("The 'nrpnEventsEnabled' property has been moved to the 'InputChannel' class."),!1}}class s extends e{constructor(e,t){super(),this.output=e,this.number=t}destroy(){this.output=null,this.number=null,this.removeListener()}send(e,t=[],n={}){return this.output.send(e,t,n),this}setKeyAftertouch(e,t,n={}){return n.useRawValue&&(n.rawValue=n.useRawValue),n.rawValue||(t=Math.round(127*t)),o.getValidNoteArray(e,n).forEach(e=>{this.send((o.MIDI_CHANNEL_VOICE_MESSAGES.keyaftertouch<<4)+(this.number-1),[e.number,t],o.convertToTimestamp(n.time))}),this}sendControlChange(e,t,n={}){return"string"==typeof e&&(e=o.MIDI_CONTROL_CHANGE_MESSAGES[e]),this.send((o.MIDI_CHANNEL_VOICE_MESSAGES.controlchange<<4)+(this.number-1),[e,t],o.convertToTimestamp(n.time)),this}_selectNonRegisteredParameter(e,t={}){return this.sendControlChange(99,e[0],t),this.sendControlChange(98,e[1],t),this}_deselectRegisteredParameter(e={}){return this.sendControlChange(101,127,e),this.sendControlChange(100,127,e),this}_deselectNonRegisteredParameter(e={}){return this.sendControlChange(101,127,e),this.sendControlChange(100,127,e),this}_selectRegisteredParameter(e,t={}){return this.sendControlChange(101,e[0],t),this.sendControlChange(100,e[1],t),this}_setCurrentParameter(e,t={}){return e=[].concat(e),this.sendControlChange(6,e[0],t),e.length<2||this.sendControlChange(38,e[1],t),this}decrementRegisteredParameter(e,t={}){return Array.isArray(e)||(e=o.MIDI_REGISTERED_PARAMETER[e]),this._selectRegisteredParameter(e,t),this.sendControlChange(97,0,t),this._deselectRegisteredParameter(t),this}incrementRegisteredParameter(e,t={}){return Array.isArray(e)||(e=o.MIDI_REGISTERED_PARAMETER[e]),this._selectRegisteredParameter(e,t),this.sendControlChange(96,0,t),this._deselectRegisteredParameter(t),this}playNote(e,t={}){if(this.sendNoteOn(e,t),t.duration>0&&isFinite(String(t.duration).trim()||NaN)){let n={time:o.convertToTimestamp(t.time)+t.duration,release:t.release,rawRelease:t.rawRelease};this.sendNoteOff(e,n)}return this}sendNoteOff(e,t={}){t.rawVelocity&&(t.rawRelease=t.velocity,console.warn("The 'rawVelocity' option is deprecated. Use 'rawRelease' instead.")),t.velocity&&(t.release=t.velocity,console.warn("The 'velocity' option is deprecated. Use 'attack' instead."));let n=64;null!=t.rawRelease?n=t.rawRelease:isNaN(t.release)||(n=Math.round(127*t.release));let r={rawRelease:parseInt(n)};return o.getValidNoteArray(e,r).forEach(e=>{this.send((o.MIDI_CHANNEL_VOICE_MESSAGES.noteoff<<4)+(this.number-1),[e.number,e.rawRelease],o.convertToTimestamp(t.time))}),this}stopNote(e,t={}){return this.sendNoteOff(e,t)}sendNoteOn(e,t={}){t.rawVelocity&&(t.rawAttack=t.velocity,t.rawRelease=t.release,console.warn("The 'rawVelocity' option is deprecated. Use 'rawAttack' or 'rawRelease'.")),t.velocity&&(t.attack=t.velocity,console.warn("The 'velocity' option is deprecated. Use 'attack' instead."));let n=64;null!=t.rawAttack?n=t.rawAttack:isNaN(t.attack)||(n=Math.round(127*t.attack));let r={rawAttack:n};return o.getValidNoteArray(e,r).forEach(e=>{this.send((o.MIDI_CHANNEL_VOICE_MESSAGES.noteon<<4)+(this.number-1),[e.number,e.rawAttack],o.convertToTimestamp(t.time))}),this}sendChannelMode(e,t,n={}){return"string"==typeof e&&(e=o.MIDI_CHANNEL_MODE_MESSAGES[e]),this.send((o.MIDI_CHANNEL_VOICE_MESSAGES.channelmode<<4)+(this.number-1),[e,t],o.convertToTimestamp(n.time)),this}setOmniMode(e,t={}){return void 0===e||e?this.sendChannelMode("omnimodeon",0,t):this.sendChannelMode("omnimodeoff",0,t),this}setChannelAftertouch(e,t={}){return this.send((o.MIDI_CHANNEL_VOICE_MESSAGES.channelaftertouch<<4)+(this.number-1),[Math.round(127*e)],o.convertToTimestamp(t.time)),this}setMasterTuning(e,t={}){e=parseFloat(e)||0;let n=Math.floor(e)+64,r=e-Math.floor(e);r=Math.round((r+1)/2*16383);let s=r>>7&127,a=127&r;return this.setRegisteredParameter("channelcoarsetuning",n,t),this.setRegisteredParameter("channelfinetuning",[s,a],t),this}setModulationRange(e,t,n={}){return this.setRegisteredParameter("modulationrange",[e,t],n),this}setNonRegisteredParameter(e,t,n={}){return t=[].concat(t),this._selectNonRegisteredParameter(e,n),this._setCurrentParameter(t,n),this._deselectNonRegisteredParameter(n),this}setPitchBend(e,t={}){let n=0,r=0;if(t.rawValue&&Array.isArray(e))n=e[0],r=e[1];else if(t.rawValue&&!Array.isArray(e))n=e;else{let t=Math.round((e+1)/2*16383);n=t>>7&127,r=127&t}return this.send((o.MIDI_CHANNEL_VOICE_MESSAGES.pitchbend<<4)+(this.number-1),[r,n],o.convertToTimestamp(t.time)),this}setPitchBendRange(e,t,n={}){return this.setRegisteredParameter("pitchbendrange",[e,t],n),this}setProgram(e,t={}){return e=parseInt(e)||1,this.send((o.MIDI_CHANNEL_VOICE_MESSAGES.programchange<<4)+(this.number-1),[e-1],o.convertToTimestamp(t.time)),this}setRegisteredParameter(e,t,n={}){return Array.isArray(e)||(e=o.MIDI_REGISTERED_PARAMETER[e]),this._selectRegisteredParameter(e,n),this._setCurrentParameter(t,n),this._deselectRegisteredParameter(n),this}setTuningBank(e,t={}){return this.setRegisteredParameter("tuningbank",e-1,t),this}setTuningProgram(e,t={}){return this.setRegisteredParameter("tuningprogram",e-1,t),this}setLocalControl(e,t={}){return e?this.sendChannelMode("localcontrol",127,t):this.sendChannelMode("localcontrol",0,t)}turnNotesOff(e={}){return this.sendChannelMode("allnotesoff",0,e)}turnSoundOff(e={}){return this.sendChannelMode("allsoundoff",0,e)}resetAllControllers(e={}){return this.sendChannelMode("resetallcontrollers",0,e)}setPolyphonicMode(e,t={}){return"mono"===e?this.sendChannelMode("monomodeon",0,t):this.sendChannelMode("polymodeon",0,t)}}class a extends e{constructor(e){if(super(),!e||"output"!==e.type)throw new TypeError("The supplied MIDIOutput is invalid.");this._midiOutput=e,this.channels=[];for(let e=1;e<=16;e++)this.channels[e]=new s(this,e);this._midiOutput.onstatechange=this._onStateChange.bind(this)}async destroy(){this.removeListener(),this.channels.forEach(e=>e.destroy()),this.channels=[],this._midiOutput.onstatechange=null,await this.close(),this._midiOutput=null}_onStateChange(e){let t={timestamp:o.time};"open"===e.port.connection?(t.type="opened",t.target=this,this.emit("opened",t)):"closed"===e.port.connection&&"connected"===e.port.state?(t.type="closed",t.target=this,this.emit("closed",t)):"closed"===e.port.connection&&"disconnected"===e.port.state?(t.type="disconnected",t.target={connection:e.port.connection,id:e.port.id,manufacturer:e.port.manufacturer,name:e.port.name,state:e.port.state,type:e.port.type},this.emit("disconnected",t)):"pending"===e.port.connection&&"disconnected"===e.port.state||console.warn("This statechange event was not caught:",e.port.connection,e.port.state)}async open(){try{return await this._midiOutput.open(),Promise.resolve(this)}catch(e){return Promise.reject(e)}}async close(){this._midiOutput?await this._midiOutput.close():await Promise.resolve()}send(e,t=[],n={}){return Array.isArray(t)||(t=[t]),"number"==typeof n&&(n={time:n}),this._midiOutput.send([e].concat(t),o.convertToTimestamp(n.time)),this}sendSysex(e,t,n={}){return t=(e=[].concat(e)).concat(t,o.MIDI_SYSTEM_MESSAGES.sysexend),this.send(o.MIDI_SYSTEM_MESSAGES.sysex,t,{time:n.time}),this}clear(){return this._midiOutput.clear?this._midiOutput.clear():console.warn("The 'clear()' method has not yet been implemented in your environment."),this}sendTimecodeQuarterFrame(e,t={}){return this.send(o.MIDI_SYSTEM_MESSAGES.timecode,e,{time:t.time}),this}setSongPosition(e,t={}){var n=(e=Math.floor(e)||0)>>7&127,r=127&e;return this.send(o.MIDI_SYSTEM_MESSAGES.songposition,[n,r],{time:t.time}),this}sendSongPosition(e,t={}){return this.setSongPosition(e,t),console.warn("The sendSongPosition() method has been deprecated. Use setSongPosition() instead."),this}setSong(e,t={}){if(e=parseInt(e),isNaN(e)||!(e>=1&&e<=128))throw new RangeError("The program value must be between 1 and 128");return this.send(o.MIDI_SYSTEM_MESSAGES.songselect,[e],{time:t.time}),this}sendSongSelect(e,t={}){return this.setSong(e,t),console.warn("The sendSongSelect() method has been deprecated. Use setSong() instead."),this}sendTuneRequest(e={}){return this.send(o.MIDI_SYSTEM_MESSAGES.tunerequest,void 0,{time:e.time}),this}sendClock(e={}){return this.send(o.MIDI_SYSTEM_MESSAGES.clock,void 0,{time:e.time}),this}sendStart(e={}){return this.send(o.MIDI_SYSTEM_MESSAGES.start,void 0,{time:e.time}),this}sendContinue(e={}){return this.send(o.MIDI_SYSTEM_MESSAGES.continue,void 0,{time:e.time}),this}sendStop(e={}){return this.send(o.MIDI_SYSTEM_MESSAGES.stop,void 0,{time:e.time}),this}sendActiveSensing(e={}){return this.send(o.MIDI_SYSTEM_MESSAGES.activesensing,[],{time:e.time}),this}sendReset(e={}){return this.send(o.MIDI_SYSTEM_MESSAGES.reset,void 0,{time:e.time}),this}sendTuningRequest(e={}){return this.sendTuneRequest(e),console.warn("The sendTuningRequest() method has been deprecated. Use sendTuningRequest() instead."),this}setKeyAftertouch(e,t,n,r={}){return o.sanitizeChannels(n).forEach(n=>{this.channels[n].setKeyAftertouch(e,t,r)}),this}sendKeyAftertouch(e,t,n,r={}){return this.setKeyAftertouch(e,n,t,r),console.warn("The sendKeyAftertouch() method has been deprecated. Use setKeyAftertouch() instead."),this}sendControlChange(e,t,n,r={}){return o.sanitizeChannels(n).forEach(n=>{this.channels[n].sendControlChange(e,t,r)}),this}setPitchBendRange(e,t,n,r={}){return o.sanitizeChannels(n).forEach(n=>{this.channels[n].setPitchBendRange(e,t,r)}),this}setRegisteredParameter(e,t,n,r={}){return o.sanitizeChannels(n).forEach(n=>{this.channels[n].setRegisteredParameter(e,t,r)}),this}setChannelAftertouch(e,t,n={}){return o.sanitizeChannels(t).forEach(t=>{this.channels[t].setChannelAftertouch(e,n)}),this}sendChannelAftertouch(e,t,n={}){return this.setChannelAftertouch(e,t,n),console.warn("The sendChannelAftertouch() method has been deprecated. Use setChannelAftertouch() instead."),this}setPitchBend(e,t,n={}){return o.sanitizeChannels(t).forEach(t=>{this.channels[t].setPitchBend(e,n)}),this}sendPitchBend(e,t,n={}){return this.setPitchBend(e,t,n),console.warn("The sendPitchBend() method has been deprecated. Use setPitchBend() instead."),this}setProgram(e,t,n={}){return o.sanitizeChannels(t).forEach(t=>{this.channels[t].setProgram(e,n)}),this}sendProgramChange(e,t,n={}){return console.warn("The sendProgramChange() method has been deprecated. Use setProgram() instead."),this.setProgram(e,t,n)}setModulationRange(e,t,n,r={}){return o.sanitizeChannels(n).forEach(n=>{this.channels[n].setModulationRange(e,t,r)}),this}setMasterTuning(e,t,n={}){return o.sanitizeChannels(t).forEach(t=>{this.channels[t].setMasterTuning(e,n)}),this}setTuningProgram(e,t,n={}){return o.sanitizeChannels(t).forEach(t=>{this.channels[t].setTuningProgram(e,n)}),this}setTuningBank(e,t,n={}){return o.sanitizeChannels(t).forEach(t=>{this.channels[t].setTuningBank(e,n)}),this}sendChannelMode(e,t,n,r={}){return o.sanitizeChannels(n).forEach(n=>{this.channels[n].sendChannelMode(e,t,r)}),this}turnSoundOff(e,t={}){return o.sanitizeChannels(e).forEach(e=>{this.channels[e].turnSoundOff(t)}),this}turnNotesOff(e,t={}){return o.sanitizeChannels(e).forEach(e=>{this.channels[e].turnNotesOff(t)}),this}resetAllControllers(e,t={}){return o.sanitizeChannels(e).forEach(e=>{this.channels[e].resetAllControllers(t)}),this}setPolyphonicMode(e,t,n={}){return o.sanitizeChannels(t).forEach(t=>{this.channels[t].setPolyphonicMode(e,n)}),this}setLocalControl(e,t,n={}){return o.sanitizeChannels(t).forEach(t=>{this.channels[t].setLocalControl(e,n)}),this}setOmniMode(e,t,n={}){return o.sanitizeChannels(t).forEach(t=>{this.channels[t].setOmniMode(e,n)}),this}setNonRegisteredParameter(e,t,n,r={}){return o.sanitizeChannels(n).forEach(n=>{this.channels[n].setNonRegisteredParameter(e,t,r)}),this}incrementRegisteredParameter(e,t,n={}){return o.sanitizeChannels(t).forEach(t=>{this.channels[t].incrementRegisteredParameter(e,n)}),this}decrementRegisteredParameter(e,t,n={}){return o.sanitizeChannels(t).forEach(t=>{this.channels[t].decrementRegisteredParameter(e,n)}),this}sendNoteOff(e,t,n){return o.sanitizeChannels(t).forEach(t=>{this.channels[t].sendNoteOff(e,n)}),this}stopNote(e,t,n){return o.sanitizeChannels(t).forEach(t=>{this.channels[t].stopNote(e,n)}),this}playNote(e,t,n={}){return n.rawVelocity&&console.warn("The 'rawVelocity' option is deprecated. Use 'rawAttack' instead."),n.velocity&&console.warn("The 'velocity' option is deprecated. Use 'velocity' instead."),o.sanitizeChannels(t).forEach(t=>{this.channels[t].playNote(e,n)}),this}sendNoteOn(e,t,n={}){return o.sanitizeChannels(t).forEach(t=>{this.channels[t].sendNoteOn(e,n)}),this}get name(){return this._midiOutput.name}get id(){return this._midiOutput.id}get connection(){return this._midiOutput.connection}get manufacturer(){return this._midiOutput.manufacturer}get state(){return this._midiOutput.state}get type(){return this._midiOutput.type}}class i{constructor(e,t={}){Number.isInteger(e)?this.number=e:this.name=e,this.duration=t.duration,this.attack=t.attack,this.release=t.release,null!=t.rawAttack&&(this.rawAttack=t.rawAttack),null!=t.rawRelease&&(this.rawRelease=t.rawRelease)}get name(){return o.NOTES[this._number%12]+o.getOctave(this.number)}set name(e){this._number=o.guessNoteNumber(e)}get number(){return this._number}set number(e){this._number=o.guessNoteNumber(e)}get duration(){return this._duration}set duration(e){this._duration=null==e?1/0:e}get attack(){return this._rawAttack/127}set attack(e){this._rawAttack=null==e?64:Math.round(127*e)}get rawAttack(){return this._rawAttack}set rawAttack(e){this._rawAttack=null==e?64:e}get release(){return this._rawRelease/127}set release(e){this._rawRelease=null==e?64:Math.round(127*e)}get rawRelease(){return this._rawRelease}set rawRelease(e){this._rawRelease=null==e?64:e}get octave(){return Math.floor(Math.floor(this._number)/12-1)}}const o=new class extends e{constructor(){super(),this.interface=null,this._inputs=[],this._outputs=[],this._stateChangeQueue=[],this._octaveOffset=0,this.isNode&&(global.performance=require("perf_hooks").performance,global.navigator=require("jzz"))}async enable(e={},t=!1){if(this.enabled)return Promise.resolve();"function"==typeof e&&(e={callback:e,sysex:t}),t&&(e.sysex=!0),this.supported||await new Promise((t,n)=>{const r=this.time,s=setInterval(()=>{if(this.supported)clearInterval(s),t();else if(this.time>r+1500){clearInterval(s);let t=new Error("Web MIDI API support is not available in your environment.");"function"==typeof e.callback&&e.callback(t),n(t)}},25)});try{this.interface=await navigator.requestMIDIAccess({sysex:e.sysex,software:e.software})}catch(t){return"function"==typeof e.callback&&e.callback(t),Promise.reject(t)}let n={timestamp:this.time,target:this,type:"enabled"};this.emit("enabled",n),"function"==typeof e.callback&&e.callback(),this.interface.onstatechange=this._onInterfaceStateChange.bind(this);try{let e=await this._updateInputsAndOutputs();return Promise.resolve({inputs:e[0],outputs:e[1]})}catch(e){return Promise.reject(e)}}async disable(){if(!this.supported)throw new Error("The Web MIDI API is not supported by your environment.");return this._destroyInputsAndOutputs().then(()=>{this.isNode&&navigator.close(),this.interface&&(this.interface.onstatechange=void 0),this.interface=null;let e={timestamp:this.time,target:this,type:"disabled"};this.emit("disabled",e),this.removeListener()})}getInputById(e){if(!this.enabled)throw new Error("WebMidi is not enabled.");if(!e)return!1;for(let t=0;t<this.inputs.length;t++)if(this.inputs[t].id===e.toString())return this.inputs[t];return!1}getInputByName(e){if(!this.enabled)throw new Error("WebMidi is not enabled.");if(!e)return!1;e=e.toString();for(let t=0;t<this.inputs.length;t++)if(~this.inputs[t].name.indexOf(e))return this.inputs[t];return!1}getOutputByName(e){if(!this.enabled)throw new Error("WebMidi is not enabled.");if(!e)return!1;e=e.toString();for(let t=0;t<this.outputs.length;t++)if(~this.outputs[t].name.indexOf(e))return this.outputs[t];return!1}getOutputById(e){if(!this.enabled)throw new Error("WebMidi is not enabled.");if(!e)return!1;for(let t=0;t<this.outputs.length;t++)if(this.outputs[t].id===e.toString())return this.outputs[t];return!1}getNoteNumberByName(e){"string"!=typeof e&&(e="");let t=e.match(/([CDEFGAB])(#{0,2}|b{0,2})(-?\d+)/i);if(!t)return!1;let n={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[t[1].toUpperCase()],r=12*(parseInt(t[3])+1-Math.floor(this.octaveOffset))+n;return t[2].toLowerCase().indexOf("b")>-1?r-=t[2].length:t[2].toLowerCase().indexOf("#")>-1&&(r+=t[2].length),!(r<0||r>127)&&r}noteNameToNumber(e){return console.warn("The noteNameToNumber() method has been deprecated. Use getNoteNumberByName() instead."),this.getNoteNumberByName(e)}getOctave(e){return e=parseInt(e),!isNaN(e)&&e>=0&&e<=127&&Math.floor(e/12-1)+this.octaveOffset}sanitizeChannels(e){let t;if("all"===e)t=["all"];else{if("none"===e)return[];t=Array.isArray(e)?e:[e]}return t.indexOf("all")>-1&&(t=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]),t.map((function(e){return parseInt(e)})).filter((function(e){return e>=1&&e<=16}))}toMIDIChannels(e){return console.warn("The toMIDIChannels() method has been deprecated. Use sanitizeChannels() instead."),this.sanitizeChannels(e)}guessNoteNumber(e){let t=!1;return Number.isInteger(e)&&e>=0&&e<=127||parseInt(e)>=0&&parseInt(e)<=127?t=parseInt(e):("string"==typeof e||e instanceof String)&&(t=this.getNoteNumberByName(e)),!1!==t&&t}getValidNoteArray(e,t={}){let n=[];return Array.isArray(e)||(e=[e]),e.forEach(e=>{n.push(this.getNoteObject(e,t))}),n}getNoteObject(e,t){if(e instanceof i)return e;{let n=this.guessNoteNumber(e);if(!1!==n)return new i(n,t);throw new TypeError(`The input could not be parsed as a note (${e})`)}}convertToTimestamp(e){let t=!1,n=parseFloat(e);return!isNaN(n)&&("string"==typeof e&&"+"===e.substring(0,1)?n>=0&&(t=this.time+n):n>=0&&(t=n),t)}async _destroyInputsAndOutputs(){let e=[];return this.inputs.forEach(t=>e.push(t.destroy())),this.outputs.forEach(t=>e.push(t.destroy())),Promise.all(e).then(()=>{this._inputs=[],this._outputs=[]})}_onInterfaceStateChange(e){this._updateInputsAndOutputs();let t={timestamp:e.timeStamp,type:e.port.state};this.interface&&"connected"===e.port.state?"output"===e.port.type?(t.port=this.getOutputById(e.port.id),t.target=t.port):"input"===e.port.type&&(t.port=this.getInputById(e.port.id),t.target=t.port):(t.port={connection:"closed",id:e.port.id,manufacturer:e.port.manufacturer,name:e.port.name,state:e.port.state,type:e.port.type},t.target=t.port),this.emit(e.port.state,t)}async _updateInputsAndOutputs(){return Promise.all([this._updateInputs(),this._updateOutputs()])}async _updateInputs(){let e=[];for(let e=0;e<this._inputs.length;e++){let t=!0,n=this.interface.inputs.values();for(let r=n.next();r&&!r.done;r=n.next())if(this._inputs[e]._midiInput===r.value){t=!1;break}t&&this._inputs.splice(e,1)}return this.interface&&this.interface.inputs.forEach(t=>{let n=!0;for(let e=0;e<this._inputs.length;e++)this._inputs[e]._midiInput===t&&(n=!1);if(n){let n=new r(t);this._inputs.push(n),e.push(n.open())}}),Promise.all(e)}async _updateOutputs(){let e=[];for(let e=0;e<this._outputs.length;e++){let t=!0,n=this.interface.outputs.values();for(let r=n.next();r&&!r.done;r=n.next())if(this._outputs[e]._midiOutput===r.value){t=!1;break}t&&(this._outputs[e].close(),this._outputs.splice(e,1))}return this.interface&&this.interface.outputs.forEach(t=>{let n=!0;for(let e=0;e<this._outputs.length;e++)this._outputs[e]._midiOutput===t&&(n=!1);if(n){let n=new a(t);this._outputs.push(n),e.push(n.open())}}),Promise.all(e)}get enabled(){return null!==this.interface}get inputs(){return this._inputs}get isNode(){return"[object process]"===Object.prototype.toString.call("undefined"!=typeof process?process:0)}get octaveOffset(){return this._octaveOffset}set octaveOffset(e){if(e=parseInt(e),isNaN(e))throw new TypeError("The 'octaveOffset' property must be a valid number.");this._octaveOffset=e}get outputs(){return this._outputs}get supported(){return!(!navigator||!navigator.requestMIDIAccess)}get sysexEnabled(){return!(!this.interface||!this.interface.sysexEnabled)}get time(){return performance.now()}get MIDI_CHANNEL_VOICE_MESSAGES(){return{noteoff:8,noteon:9,keyaftertouch:10,controlchange:11,channelmode:11,nrpn:11,programchange:12,channelaftertouch:13,pitchbend:14}}get MIDI_CHANNEL_MESSAGES(){return console.warn("MIDI_CHANNEL_MESSAGES has been deprecated. Use MIDI_CHANNEL_VOICE_MESSAGES instead."),this.MIDI_CHANNEL_VOICE_MESSAGES}get MIDI_CHANNEL_MODE_MESSAGES(){return{allsoundoff:120,resetallcontrollers:121,localcontrol:122,allnotesoff:123,omnimodeoff:124,omnimodeon:125,monomodeon:126,polymodeon:127}}get MIDI_CONTROL_CHANGE_MESSAGES(){return{bankselectcoarse:0,modulationwheelcoarse:1,breathcontrollercoarse:2,footcontrollercoarse:4,portamentotimecoarse:5,dataentrycoarse:6,volumecoarse:7,balancecoarse:8,pancoarse:10,expressioncoarse:11,effectcontrol1coarse:12,effectcontrol2coarse:13,generalpurposeslider1:16,generalpurposeslider2:17,generalpurposeslider3:18,generalpurposeslider4:19,bankselectfine:32,modulationwheelfine:33,breathcontrollerfine:34,footcontrollerfine:36,portamentotimefine:37,dataentryfine:38,volumefine:39,balancefine:40,panfine:42,expressionfine:43,effectcontrol1fine:44,effectcontrol2fine:45,holdpedal:64,portamento:65,sustenutopedal:66,softpedal:67,legatopedal:68,hold2pedal:69,soundvariation:70,resonance:71,soundreleasetime:72,soundattacktime:73,brightness:74,soundcontrol6:75,soundcontrol7:76,soundcontrol8:77,soundcontrol9:78,soundcontrol10:79,generalpurposebutton1:80,generalpurposebutton2:81,generalpurposebutton3:82,generalpurposebutton4:83,reverblevel:91,tremololevel:92,choruslevel:93,celestelevel:94,phaserlevel:95,databuttonincrement:96,databuttondecrement:97,nonregisteredparametercoarse:98,nonregisteredparameterfine:99,registeredparametercoarse:100,registeredparameterfine:101}}get MIDI_INTERFACE_EVENTS(){return["connected","disconnected"]}get MIDI_NRPN_MESSAGES(){return{entrymsb:6,entrylsb:38,increment:96,decrement:97,paramlsb:98,parammsb:99,nullactiveparameter:127}}get MIDI_REGISTERED_PARAMETER(){return{pitchbendrange:[0,0],channelfinetuning:[0,1],channelcoarsetuning:[0,2],tuningprogram:[0,3],tuningbank:[0,4],modulationrange:[0,5],azimuthangle:[61,0],elevationangle:[61,1],gain:[61,2],distanceratio:[61,3],maximumdistance:[61,4],maximumdistancegain:[61,5],referencedistanceratio:[61,6],panspreadangle:[61,7],rollangle:[61,8]}}get MIDI_SYSTEM_MESSAGES(){return{sysex:240,timecode:241,songposition:242,songselect:243,tunerequest:246,tuningrequest:246,sysexend:247,clock:248,start:250,continue:251,stop:252,activesensing:254,reset:255,midimessage:0,unknownsystemmessage:-1}}get NOTES(){return["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]}};o.constructor=null,exports.Note=i,exports.WebMidi=o;
//# sourceMappingURL=webmidi.cjs.production.js.map
