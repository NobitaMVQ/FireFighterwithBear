import { TUNING } from './config';
export class ToyAudio {
  muted=false; context?: AudioContext; lastSiren=-10; waterTimer=0;
  unlock(){ this.context ??= new AudioContext(); void this.context.resume(); }
  tone(freq:number,duration=.18,type:OscillatorType='sine',delay=0){if(this.muted||!this.context)return;const c=this.context,o=c.createOscillator(),g=c.createGain(),t=c.currentTime+delay;o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(TUNING.volume,t+.025);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+duration);}
  siren(time:number){if(time-this.lastSiren<2)return;this.lastSiren=time;this.tone(470,.35);this.tone(620,.4,'sine',.25);}
  chime(){[523,659,784,1046].forEach((n,i)=>this.tone(n,.5,'sine',i*.16));}
  water(dt:number){this.waterTimer-=dt;if(this.waterTimer<=0){this.waterTimer=.1;this.tone(900+Math.random()*200,.1,'triangle');}}
}
