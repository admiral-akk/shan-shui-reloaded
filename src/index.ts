import { parseQueryParams } from "./ParseArgs";
import { InitializeGlobalVariables } from "./GlobalVariables"
import { UniformRNG } from "./UniformRNG";
import { PerlinNoise } from "./PerlinNoise";
import { PolyTools } from "./PolyTools";
import { Tree } from "./Tree";
import { Arch } from "./Arch";
import { Mount } from "./Mount";
import { Man } from "./Man";
import { MountPlanner } from "./MountPlanner";
import { Memory } from "./Memory";
import { Update } from "./Update";

const rng = new UniformRNG();

const seed = parseQueryParams();
rng.seed(seed);

const perlin = new PerlinNoise(rng);
const polyTools = new PolyTools();

const memory = new Memory();
const tree = new Tree(perlin, polyTools);
const man = new Man(perlin, polyTools);
const arch = new Arch(perlin, polyTools, man);
const mount = new Mount(perlin, tree, arch, polyTools);
const mountPlanner = new MountPlanner(perlin, memory);
const update = new Update(memory, mountPlanner, mount, perlin, arch);

// We add global variables at the end to ensure that we don't inadvertidly depend on them in our Typescript.
InitializeGlobalVariables(rng, seed, perlin, polyTools, tree, mount, arch, man, mountPlanner, memory, update);