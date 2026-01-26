import { useMenu } from "@/lib/menu";

export default function MenuDrawer() {
  const menu = useMenu();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={menu.closeMenu}
        className="
          fixed inset-0
          bg-black/40
          backdrop-blur-md
          z-40
        "
      />

      {/* Drawer */}
      <div
        className="
          fixed top-0 left-0
          md:w-1/3
          w-1/2
          h-screen
          bg-(--bg-secondary)
          z-50
          shadow-lg
        "
      >
        <div className="flex flex-col w-full gap-2 py-3 px-3">
          <p>Menu</p>
        </div>
        <div className="w-full px-2">
          <div className="w-full h-px bg-(--soft-border)" />
        </div>
      </div>
    </>
  );
}
