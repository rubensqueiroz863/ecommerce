export type MenuState = {
  isOpen: boolean;
  toggleMenu: () => void;
  openMenu: () => void;
  closeMenu: () => void;
};

export type MenuItem = {
  label: string;
  submenu?: { label: string; onClick?: () => void }[];
};