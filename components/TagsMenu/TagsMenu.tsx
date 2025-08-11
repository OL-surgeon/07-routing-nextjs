"use client";

import { useState } from "react";
import Link from "next/link";
import css from "./TagsMenu.module.css";

const TagsMenu = () => {
  const categories = ["All", "Work", "Personal", "Meeting", "Shopping", "Todo"];

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const handleLinkClick = () => setIsOpen(false);

  return (
    <div className={css.menuContainer}>
      <button onClick={toggle} className={css.menuBtn}>
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          <li className={css.menuItem}>
            <Link
              href="/notes/filter/All"
              onClick={handleLinkClick}
              className={css.menuLink}
            >
              All notes
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category} className={css.menuItem}>
              <Link
                href={`/notes/filter/${category}`}
                onClick={handleLinkClick}
                className={css.menuLink}
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsMenu;
