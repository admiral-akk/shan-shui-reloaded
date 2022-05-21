import { Arch } from "./Arch";
import { Memory } from "./Memory";
import { Mount } from "./Mount";
import { MountPlanner } from "./MountPlanner";
import { PerlinNoise } from "./PerlinNoise";
import { randChoice } from "./Utils";
import { water } from "./Water";

export class Update {
    mouseX = 0;
    mouseY = 0;
    private onMouseUpdate(e: MouseEvent) {
        this.mouseX = e.pageX;
        this.mouseY = e.pageY;
    }
    constructor(private MEM: Memory, private mountPlanner: MountPlanner,
        private mount: Mount, private Noise: PerlinNoise, private arch: Arch) {
        document.addEventListener("mousemove", (ev: MouseEvent) => this.onMouseUpdate(ev), false);
        document.addEventListener("mouseenter", (ev: MouseEvent) => this.onMouseUpdate(ev), false);
    }

    private add(nch: any) {
        if (nch.canv.includes("NaN")) {
            console.log("gotcha:");
            console.log(nch.tag);
            nch.canv = nch.canv.replace(/NaN/g, -1000);
        }
        if (this.MEM.chunks.length == 0) {
            this.MEM.chunks.push(nch);
            return;
        } else {
            if (nch.y <= this.MEM.chunks[0].y) {
                this.MEM.chunks.unshift(nch);
                return;
            } else if (nch.y >= this.MEM.chunks[this.MEM.chunks.length - 1].y) {
                this.MEM.chunks.push(nch);
                return;
            } else {
                for (var j = 0; j < this.MEM.chunks.length - 1; j++) {
                    if (this.MEM.chunks[j].y <= nch.y && nch.y <= this.MEM.chunks[j + 1].y) {
                        this.MEM.chunks.splice(j + 1, 0, nch);
                        return;
                    }
                }
            }
        }
        console.log("EH?WTF!");
        console.log(this.MEM.chunks);
        console.log(nch);
    }
    chunkloader(xmin: number, xmax: number) {

        while (xmax > this.MEM.xmax - this.MEM.cwid || xmin < this.MEM.xmin + this.MEM.cwid) {
            console.log("generating new chunk...");

            var plan;
            if (xmax > this.MEM.xmax - this.MEM.cwid) {
                plan = this.mountPlanner.mountplanner(this.MEM.xmax, this.MEM.xmax + this.MEM.cwid);
                this.MEM.xmax = this.MEM.xmax + this.MEM.cwid;
            } else {
                plan = this.mountPlanner.mountplanner(this.MEM.xmin - this.MEM.cwid, this.MEM.xmin);
                this.MEM.xmin = this.MEM.xmin - this.MEM.cwid;
            }

            for (var i = 0; i < plan.length; i++) {
                if (plan[i].tag == "mount") {
                    this.add({
                        tag: plan[i].tag,
                        x: plan[i].x,
                        y: plan[i].y,
                        canv: this.mount.mountain(plan[i].x, plan[i].y, i * 2 * Math.random()),
                        //{col:function(x){return "rgba(100,100,100,"+(0.5*Math.random()*plan[i].y/MEM.windy)+")"}}),
                    });
                    this.add({
                        tag: plan[i].tag,
                        x: plan[i].x,
                        y: plan[i].y - 10000,
                        canv: water(plan[i].x, plan[i].y, i * 2, this.Noise),
                    });
                } else if (plan[i].tag == "flatmount") {
                    this.add({
                        tag: plan[i].tag,
                        x: plan[i].x,
                        y: plan[i].y,
                        canv: this.mount.flatMount(
                            plan[i].x,
                            plan[i].y,
                            2 * Math.random() * Math.PI,
                            {
                                wid: 600 + Math.random() * 400,
                                hei: 100,
                                cho: 0.5 + Math.random() * 0.2,
                            },
                        ),
                    });
                } else if (plan[i].tag == "distmount") {
                    this.add({
                        tag: plan[i].tag,
                        x: plan[i].x,
                        y: plan[i].y,
                        canv: this.mount.distMount(plan[i].x, plan[i].y, Math.random() * 100, {
                            hei: 150,
                            len: randChoice([500, 1000, 1500]),
                        }),
                    });
                } else if (plan[i].tag == "boat") {
                    this.add({
                        tag: plan[i].tag,
                        x: plan[i].x,
                        y: plan[i].y,
                        canv: this.arch.boat01(plan[i].x, plan[i].y, Math.random(), {
                            sca: plan[i].y / 800,
                            fli: randChoice([true, false]),
                        }),
                    });
                } else if (plan[i].tag == "redcirc") {
                    this.add({
                        tag: plan[i].tag,
                        x: plan[i].x,
                        y: plan[i].y,
                        canv:
                            "<circle cx='" +
                            plan[i].x +
                            "' cy='" +
                            plan[i].y +
                            "' r='20' stroke='black' fill='red' />",
                    });
                } else if (plan[i].tag == "greencirc") {
                    this.add({
                        tag: plan[i].tag,
                        x: plan[i].x,
                        y: plan[i].y,
                        canv:
                            "<circle cx='" +
                            plan[i].x +
                            "' cy='" +
                            plan[i].y +
                            "' r='20' stroke='black' fill='green' />",
                    });
                }
                // add ({
                //   x: plan[i].x,
                //   y: plan[i].y,
                //   canv:"<circle cx='"+plan[i].x+"' cy='"+plan[i].y+"' r='20' stroke='black' fill='red' />"
                // })
            }
        }
    }

    chunkrender(xmin: number, xmax: number) {
        this.MEM.canv = "";

        for (var i = 0; i < this.MEM.chunks.length; i++) {
            if (
                xmin - this.MEM.cwid < this.MEM.chunks[i].x &&
                this.MEM.chunks[i].x < xmax + this.MEM.cwid
            ) {
                this.MEM.canv += this.MEM.chunks[i].canv;
            }
        }
    }

    calcViewBox() {
        var zoom = 1.142;
        return "" + this.MEM.cursx + " 0 " + this.MEM.windx / zoom + " " + this.MEM.windy / zoom;
    }

    viewupdate() {
        try {
            document.getElementById("SVG")!.setAttribute("viewBox", this.calcViewBox());
        } catch (e) {
            console.log("not possible");
        }
        //setTimeout(viewupdate,100)
    }

    needupdate(): boolean {
        return true;
        // if (this.MEM.xmin < this.MEM.cursx && this.MEM.cursx < this.MEM.xmax - this.MEM.windx) {
        //     return false;
        // }
        // return true;
    }

    update() {
        //console.log("update!")

        this.chunkloader(this.MEM.cursx, this.MEM.cursx + this.MEM.windx);
        this.chunkrender(this.MEM.cursx, this.MEM.cursx + this.MEM.windx);

        document.getElementById("BG")!.innerHTML =
            "<svg id='SVG' xmlns='http://www.w3.org/2000/svg' width='" +
            this.MEM.windx +
            "' height='" +
            this.MEM.windy +
            "' style='mix-blend-mode:multiply;'" +
            "viewBox = '" +
            this.calcViewBox() +
            "'" +
            "><g id='G' transform='translate(" +
            0 +
            ",0)'>" +
            this.MEM.canv +
            //+ "<circle cx='0' cy='0' r='50' stroke='black' fill='red' />"
            "</g></svg>";

        //setTimeout(update,1000);
    }
}