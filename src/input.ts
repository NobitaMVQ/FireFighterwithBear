import Phaser from 'phaser';
export class CrewInput {
 keys: Record<string,Phaser.Input.Keyboard.Key>; held=false; pending=new Set<string>();
 constructor(scene:Phaser.Scene){this.keys=scene.input.keyboard!.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,E,H,P,ESC,M') as typeof this.keys;scene.input.keyboard!.addCapture(['UP','DOWN','LEFT','RIGHT','SPACE']);scene.input.keyboard!.on('keydown',(event:KeyboardEvent)=>{if(!event.repeat){const name=event.key.toUpperCase().replace('ARROW','').replace('ESCAPE','ESC');this.pending.add(name===' '?'SPACE':name);}});scene.input.on('pointerdown',()=>this.held=true);scene.input.on('pointerup',()=>this.held=false);}
 clear(){this.pending.clear();this.held=false;Object.values(this.keys).forEach(k=>k.reset());}
 axis(){return new Phaser.Math.Vector2(Number(this.keys.D.isDown||this.keys.RIGHT.isDown)-Number(this.keys.A.isDown||this.keys.LEFT.isDown),Number(this.keys.S.isDown||this.keys.DOWN.isDown)-Number(this.keys.W.isDown||this.keys.UP.isDown)).normalize();}
 pressed(k:string){const down=this.pending.has(k);this.pending.delete(k);return down;}
}
