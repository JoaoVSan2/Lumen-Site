STYLIZED COZY TOWN - FREE SAMPLER - 16 game-ready low poly models
=========================================================================

Free models from Stylized Cozy Town, the same quality as the paid pack: a shopping cart, a vending machine,
a sofa, a coffee table, a street lamp, a bench, a car and a road tile you can build a street with.

CONTENTS
  FBX/        16 models for Unity / Unreal (+ both palette textures)
  GLB/        16 models for Godot, Three.js, web and Blender (textures and glow embedded)
  Textures/   TownPalette.png, plus TownPalette_Emission.png, the glow map
  Unity/      Editor/StylizedTownFreeImporter.cs - automatic colliders, physics, LOD groups and glow
  Previews~/  a picture of every model
  catalog.json  size, triangles, physics type and mass of every model

GAME-READY
  - LOD0 + LOD1 for every model, convex collision meshes (UCX_) on all 16
  - 9 models have physics with a real mass: shopping cart 14.7 kg, shopping basket 1.2 kg, cardboard box 4.2 kg, wet floor sign 1.7 kg, coffee table 28.9 kg, chair 5.9 kg, plant pot 6.4 kg, table lamp 2.4 kg, car hatchback 1281 kg
  - Glow: the street lamp, the table lamp, the vending machine and the car lights have a real emission map
  - Real-world scale in metres, pivot at the base. The road tile is 8 x 8 m (road + raised sidewalks,
    separate colliders so cars drive on the road).

UNITY (Unity 6, URP or Built-in): copy the folder "StylizedTown_FreeSampler" into Assets (keep the name).
  Add a Bloom effect to your URP Volume and the lamps will shine.
GODOT 4: drag the GLB files in. Collision shapes, LODs and glow come with them.
  Turn on Glow in your WorldEnvironment to make the lamps shine.
UNREAL: import the FBX files (UCX_ collision naming). Connect TownPalette_Emission.png to Emissive Color. Not tested yet.

FOLDERS ENDING IN ~
  Unity skips Previews~ (that is what the ~ means), and Godot skips it too (it holds a .gdignore file).

8,454 triangles for all 16 models (LOD0).

WANT THE FULL TOWN? (same style)
  Stylized Cozy Town - 85 models: a supermarket full of products, furniture for every room, houses, shops,
  cars and a road kit that snaps together
     https://soresa-assets.itch.io/stylized-cozy-town

License: see LICENSE.txt
