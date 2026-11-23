Low Poly Supermarket Kit v1.0.2 - Standard edition
=================================================

FREE (name your own price, from $0): 30 hand-picked assets from every family (brick walls with real glass, sliding doors, MARKET neon sign, aisles, fridges, checkout, produce, butcher, bakery, warehouse, a car, a parking tile), GLB / FBX / OBJ, 4 color palettes.

COLLISIONS: FBX/GLB/OBJ: visual models, no collision meshes. Godot scenes and the Unreal project (Pro) include collisions.

Modern supermarket kit for games, prototypes and renders. This free Standard edition contains 30 sample
assets: 3 brick walls (plain, wide window with real glass, sliding door), a corner pier, a roof tile and a floor tile,
the MARKET neon sign, 2 aisles, an open chiller, a freezer island, a checkout lane, a self-checkout kiosk, nested
carts and a basket tower, 3 produce displays, butcher and bakery counters, a pallet rack bay, a forklift, a dock
roller door, a pylon sign, a hanging fruit pictogram, an apple neon, a cart shelter, a soda pallet, 1 car with
separate wheels and 1 parking tile (full list below).
COMPLETE / PRO ONLY (143 assets): brick piers, entrance with fronton, storefront modules with a furnished lit
interior, ceiling and partition pieces, more aisles, end caps, fridges and freezers, fish and deli counters, the
rest of the back store (pallet jack, dock ramp...), more parking tiles, 3 more cars and a grocery van, more signs,
hanging items and neons, Mart_Sign_Lightbox_Neon_6m (the MARKET sign without text), and (new in v1.0.2) the
ground tiles, 2 sky domes, 7 neon halos and 3 display bases.
Standard GLB / FBX / OBJ files, tested with Godot 4.7 (GLB import and scenes), Blender 5.2 and Unreal Engine 5.8 (all FBX files imported and used in the Pro Unreal project); other engines (Unity...): not tested.
Objects only: no characters, no real brands. No readable text except the generic word MARKET on the neon sign
Mart_Sign_Neon_Market_6m. Products are plain colored packs without labels; signs use generic pictograms.
Part of the "Amano Props" series and of the Low Poly Town series: same scale, same palette layout and same
grid as Town Starter MegaKit, Route 66 Desert Stop and Gas Station 24h Kit (sold separately), so the packs combine:
modular parts snap to a 4 m grid (walls, floor / roof tiles, parking tiles, racks) and a 2 m grid (aisles, fridges).

GLASS - READ THIS
  Storefronts, doors, freezer doors and display cases use a second material, "PropsGlass" (plain color, alpha 0.2,
  no texture). GLB and OBJ keep it transparent. In Godot the FBX files arrive with OPAQUE glass (the Godot FBX
  importer ignores the transparency): use the GLB files in Godot (recommended), or set Transparency to Alpha on the
  PropsGlass material by hand. Glass polygons are also UV-mapped to the light blue "store_glass" cell, so an engine
  that ignores transparency shows a bluish glass instead of a hole.

CONTENTS
  Models/GLB/   glTF binary (recommended: Godot 4)
  Models/FBX/   FBX files for Blender and other 3D tools - the palette texture sits next to the models and loads automatically
  Models/OBJ/   OBJ + MTL
  Textures/     props_palette.png + props_emission.png (glow map)
                + 3 alternative palettes with their glow maps: _night / _pastel / _winter
  Docs/         STYLE_GUIDE.txt + Palette_Chart.png + RENDER_SETTINGS.txt (sky, lights, fog, glow values)

NOT INCLUDED
  - The ground tiles, sky domes, neon halos and display bases (new in v1.0.2) are in the Complete and Pro editions;
    the Godot demo scenes, the Environment files, the .blend file and the Unreal project are in the Pro edition ONLY.
  - The engine's bloom post-process and the 2D layout of the contact sheets are not models. No characters.

CHANGELOG
  1.0.2  Mart_Sign_Neon_Market_6m redrawn (thinner neon tubes, yellow underline); the 29 other models unchanged.
         New ground tiles, sky domes, neon halos, display bases: Complete / Pro; Godot scenes, .blend and
         Unreal project: Pro only. Palette textures: colors added in free cells only.
  1.0.1  initial release

SPECS
  - Real-world scale in meters, Y-up on export (Z-up inside Blender), origin on the ground at the center of the
    object, front of every object = -Y in Blender.
  - Walls (Mart_Wall_Plain_4m, _Window_Wide_4m, _Door_Slide_4m): 4 m wide x 5 m high (parapet included), 0.25 m
    thick, centered on the grid line, origin at the foot of the wall, outside = -Y. Brick facing, steel ledge with
    spots, grey panel and coping. Mart_Wall_Corner (0.7 x 0.7 m brick pier) covers the corner joint.
  - Mart_Roof_Flat_4m (4 x 4 m): top at 4.5 m, white ceiling at 4.3 m. Mart_Floor_Tile_4m (4 x 4 m): top at z = 0.
    Hanging_Icon_Fruit has its origin ON THE CEILING (it hangs below it).
  - Mart_Lot_Stalls_Wheelstop_4m: 4 x 4 m parking tile, road top at z = 0, like the Town Starter road tiles.
  - Aisles and fridges: 2 m modules placed end to end on X. Pallet_Rack_Bay_4m bays go end to end too.
  - Moving parts are separate child objects: sliding door leaves (_Leaf_L / _Leaf_R), conveyor belt (_Belt), freezer
    lids (_Lid_Slide_A / B), dock roller door (_Door: moves up on Z), forklift forks (_Fork), car wheels
    (_Wheel_FL / FR / RL / RR, pivot on the hub).
  - Vehicle: Mart_Car_Compact, unbranded, without driver (tinted opaque windows, no cabin interior), front = -Y.
  - Neon_Apple_Market is a wall item: its back is on the wall plane (local y = 0).
  - Low poly, flat shaded: 54 to 2,222 polygons (quads) per asset (design limit: 2,500 polygons per asset).
  - One shared palette material + the PropsGlass material (+ PropsHalo on the neon halos and PropsSky on the sky domes,
    new in v1.0.2). Use nearest / point filtering for the palette texture.
  - Sky, sun / moon, lamp lights, fog, exposure and glow values of the images: Docs/RENDER_SETTINGS.txt.
  - Lights, neons, LED panels and screens use the emission map (Textures/props_emission.png, also embedded
    in every GLB). In the Night palette the windows light up too (props_emission_night.png).
  - 4 free color palettes with the same UVs: Classic (props_palette.png), Night, Pastel and Winter
    (props_palette_<name>.png + props_emission_<name>.png): swap both images to recolor.
  - See Docs/STYLE_GUIDE.txt for the palette table and naming rules.

ASSETS (30: Aisles 2, Building 6, Checkout 4, Counters 2, Exterior 1, Fresh 2, Neon 1, Parking 1, Produce 3, Products 1, Signs 3, Vehicles 1, Warehouse 3)
  [Building] Mart_Wall_Plain_4m  (408 polygons)
  [Building] Mart_Wall_Window_Wide_4m  (574 polygons)
  [Building] Mart_Wall_Door_Slide_4m  (648 polygons)
  [Building] Mart_Wall_Corner  (246 polygons)
  [Building] Mart_Roof_Flat_4m  (80 polygons)
  [Building] Mart_Floor_Tile_4m  (54 polygons)
  [Signs] Mart_Sign_Neon_Market_6m  (1290 polygons)
  [Aisles] Aisle_Shelf_Double_2m  (174 polygons)
  [Aisles] Aisle_Shelf_Cereal_2m  (942 polygons)
  [Fresh] Chiller_Multideck_Open_2m  (606 polygons)
  [Fresh] Freezer_Island_Lid_2m  (286 polygons)
  [Checkout] Checkout_Lane_Conveyor_Market  (300 polygons)
  [Checkout] Self_Checkout_Kiosk  (256 polygons)
  [Checkout] Cart_Nested_Row_Market  (882 polygons)
  [Checkout] Basket_Stack_Tower  (374 polygons)
  [Produce] Produce_Table_Tiered_Market  (2222 polygons)
  [Produce] Fruit_Pyramid_Apple_Market  (1410 polygons)
  [Produce] Banana_Stand_Hanging  (874 polygons)
  [Counters] Butcher_Counter_Glass  (802 polygons)
  [Counters] Bakery_Counter_Glass  (732 polygons)
  [Warehouse] Pallet_Rack_Bay_4m  (1464 polygons)
  [Warehouse] Forklift_Electric_Market  (590 polygons)
  [Warehouse] Dock_Door_Roller_Market_4m  (570 polygons)
  [Signs] Pylon_Supermarket_Tall  (366 polygons)
  [Signs] Hanging_Icon_Fruit  (282 polygons)
  [Neon] Neon_Apple_Market  (294 polygons)
  [Exterior] Cart_Shelter_Roofed_4m  (222 polygons)
  [Products] Soda_Multipack_Pallet  (1308 polygons)
  [Vehicles] Mart_Car_Compact  (437 polygons)
  [Parking] Mart_Lot_Stalls_Wheelstop_4m  (100 polygons)

LICENSE
  See LICENSE.txt. You may use these assets in personal and commercial projects.
  You may not resell or redistribute the assets themselves, even modified.
