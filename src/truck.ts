import Phaser from 'phaser';
import {TUNING} from './config';
export class Truck {
 x=260;y=540; angle=0;
 move(axis:Phaser.Math.Vector2,dt:number){this.x=Phaser.Math.Clamp(this.x+axis.x*TUNING.speed*dt,90,1190);this.y=Phaser.Math.Clamp(this.y+axis.y*TUNING.speed*dt,340,625);if(axis.length()>0)this.angle=Phaser.Math.Angle.RotateTo(this.angle,axis.angle(),dt*5);}
 get parked(){return Phaser.Math.Distance.Between(this.x,this.y,965,460)<92;}
}
