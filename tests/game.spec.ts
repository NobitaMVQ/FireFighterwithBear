import {test,expect,Page} from '@playwright/test';
async function state(page:Page){return page.evaluate(()=>(window as any).__crew.mission.stage);}
async function point(page:Page,x:number,y:number){const b=await page.locator('canvas').boundingBox();await page.mouse.move(b!.x+x*b!.width/1280,b!.y+y*b!.height/720);}
test('cooperative mission, water targeting, rescue, free play, controls',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await page.goto('/');await page.getByRole('button',{name:'Let’s play'}).click();
 await page.keyboard.down('ArrowRight');await expect.poll(()=>state(page)).toBe('fires');await page.keyboard.up('ArrowRight');
 // Mouse aim assistance from a point offset from the flame.
 await point(page,825,342);await page.mouse.down();await expect.poll(()=>page.evaluate(()=>(window as any).__crew.fires[0].heat),{timeout:15000}).toBe(0);await page.mouse.up();
 // Parent fallback reaches both other fires without mouse targeting.
 await page.keyboard.down('h');await expect.poll(()=>state(page),{timeout:25000}).toBe('park');await page.keyboard.up('h');
 await page.keyboard.press('e');expect(await state(page)).toBe('park');
 await page.keyboard.down('ArrowRight');await expect.poll(()=>page.evaluate(()=>(window as any).__crew.truck.x),{intervals:[50]}).toBeGreaterThan(930);await page.keyboard.up('ArrowRight');await page.keyboard.down('ArrowUp');await expect.poll(()=>page.evaluate(()=>(window as any).__crew.truck.y),{intervals:[50]}).toBeLessThan(470);await page.keyboard.up('ArrowUp');
 await page.keyboard.press('e');await expect.poll(()=>state(page)).toBe('ladder');await expect.poll(()=>page.evaluate(()=>(window as any).__crew.basket),{timeout:15000}).toBeGreaterThan(.95);await point(page,1060,232);
 await page.mouse.down();await page.mouse.up();await expect.poll(()=>state(page),{timeout:8000}).toBe('celebrate');
 await page.getByRole('button',{name:'Free play'}).click();expect(await state(page)).toBe('free');await point(page,640,633);await page.mouse.down();await page.waitForTimeout(1000);await page.mouse.up();expect(await page.evaluate(()=>(window as any).__crew.bloom)).toBeGreaterThan(0);
 await page.getByRole('button',{name:'Mute sound',exact:true}).click();expect(await page.evaluate(()=>(window as any).__crew.audio.muted)).toBe(true);
 await page.keyboard.press('p');await expect(page.getByRole('button',{name:'Resume'})).toBeVisible();await page.getByRole('button',{name:'Resume'}).click();
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));expect(await page.evaluate(()=>(window as any).__crew.paused)).toBe(true);await page.getByRole('button',{name:'Resume'}).click();
 await page.setViewportSize({width:1280,height:800});await page.screenshot({path:'test-results/garden.png'});expect(errors).toEqual([]);
});
test('restart resets every mission stage and retraction stays usable',async({page})=>{test.setTimeout(30000);await page.goto('/');await page.getByRole('button',{name:'Let’s play'}).click();for(const stage of ['drive','fires','park','ladder','rescuing','free']){await page.evaluate(s=>{const g=(window as any).__crew;g.mission.stage=s;g.pause();},stage);await page.getByRole('button',{name:'↻ Restart',exact:true}).click();expect(await state(page)).toBe('drive');expect(await page.evaluate(()=>(window as any).__crew.fires.every((f:any)=>f.heat===1)&&!(window as any).__crew.crew.held)).toBe(true);}await page.evaluate(()=>{const g=(window as any).__crew;g.mission.stage='park';g.truck.x=965;g.truck.y=460;});await page.keyboard.press('e');await expect.poll(()=>state(page)).toBe('ladder');await page.keyboard.press('e');await expect.poll(()=>state(page)).toBe('park');});
test('Round 2 flies a helicopter, puts out fires, and rescues both people',async({page})=>{
 test.setTimeout(30000);await page.goto('/');await page.getByRole('button',{name:'🚁 Play Round 2'}).click();expect(await state(page)).toBe('round2-flight');
 await page.keyboard.press('p');await page.getByRole('button',{name:'Choose a round'}).click();await page.getByRole('button',{name:'🚒 Round 1 · Garden rescue'}).click();expect(await state(page)).toBe('drive');
 await page.keyboard.press('p');await page.getByRole('button',{name:'Choose a round'}).click();await page.getByRole('button',{name:'🚁 Round 2 · Helicopter rescue'}).click();expect(await state(page)).toBe('round2-flight');
 const before=await page.evaluate(()=>(window as any).__crew.heli.x);await page.keyboard.down('ArrowRight');await page.waitForTimeout(250);await page.keyboard.up('ArrowRight');expect(await page.evaluate(()=>(window as any).__crew.heli.x)).toBeGreaterThan(before);
 await page.evaluate(()=>{const g=(window as any).__crew;g.heli={x:380,y:300};});await point(page,380,300);await page.mouse.down();await expect.poll(()=>page.evaluate(()=>(window as any).__crew.fires[0].heat),{timeout:15000}).toBe(0);await page.mouse.up();
 await page.evaluate(()=>{const g=(window as any).__crew;g.fires[1].heat=0;g.fires[2].heat=0;g.heli={x:420,y:520};});await page.keyboard.press('e');await expect.poll(()=>page.evaluate(()=>(window as any).__crew.survivors[0].saved)).toBe(true);
 await page.evaluate(()=>{const g=(window as any).__crew;g.heli={x:1030,y:535};});await page.keyboard.press('e');await expect.poll(()=>state(page)).toBe('round2-celebrate');await expect(page.getByRole('button',{name:'↻ Play Round 2 again'})).toBeVisible();
});
