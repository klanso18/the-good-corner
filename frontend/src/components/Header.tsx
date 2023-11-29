import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Category } from "@/types";
import qs from "query-string";
import { useGetCategoriesQuery } from "@/graphql/generated/schema";
import Image from "next/image";

export default function Header() {
  const router = useRouter();

  const { data } = useGetCategoriesQuery();
  const categories = data?.categories || [];

  // const [categories, setCategories] = useState<Category[]>([]);

  // useEffect(() => {
  //   axios
  //     .get<Category[]>("http://localhost:4000/categories")
  //     .then((res) => setCategories(res.data))
  //     .catch(console.error);
  // }, []);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (typeof router.query.title === "string") {
      setSearch(router.query.title);
    }
  }, [router.query.title]);

  const searchParams = qs.parse(window.location.search) as any;

  return (
    <>
      <header className="header">
        <div className="logo">
          <Link href="/" className="teddy-logo">
            <Image src="/images/logo-good-corner.png" alt="logo" />
          </Link>
        </div>
        <div className="navbar">
          <div className="nav-1 w-full p-2 pl-28">
            {categories.map((cat) => {
              const [firstLetter, ...resetOfCatName] = cat.name.split("");
              const catName =
                firstLetter.toUpperCase() + resetOfCatName.join("");
              const isActive = router.query.categoryId === cat.id.toString();

              return (
                <div
                  className={`btn btn-ghost normal-case text-base ${
                    isActive ? "bg-[#ffa41b] text-white" : ""
                  }`}
                  onClick={() => {
                    router.push(
                      "/search?" +
                        qs.stringify({
                          ...searchParams,
                          categoryId: isActive ? undefined : cat.id,
                        })
                    );
                  }}
                  key={catName}
                >
                  {catName}
                </div>
              );
            })}
            <Link href="/new-ad" className="button link-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="mobile-short-label">Publier</span>
              <span className="desktop-long-label">Publier une annonce</span>
            </Link>
            <div className="flex-none gap-2 ml-3 pt-1.5">
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-12 rounded-full">
                    <Image src="/images/profile.jpeg" alt="profil picture" />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </a>
                  </li>
                  <li>
                    <a>Settings</a>
                  </li>
                  <li>
                    <a>Logout</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="search-container">
          <div className="nav-2">
            <div className="flex-1">
              <form
                className="text-field-with-button"
                onSubmit={(e) => {
                  e.preventDefault();
                  router.push(
                    `/search?${qs.stringify({
                      ...searchParams,
                      title: search,
                    })}`
                  );
                }}
              >
                <input
                  className="input input-bordered w-2/3 search-input"
                  type="search"
                  value={search}
                  placeholder="Rechercher..."
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="button button-primary search-btn">
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="-50 -50 530 550"
                    transform="scale(-1, 1)"
                    fill="currentColor"
                    xmlSpace="preserve"
                    className="styled__BaseIcon-sc-1jsm4qr-0 llmHhT"
                  >
                    <path d="m464.524 412.846-97.929-97.925c23.6-34.068 35.406-72.047 35.406-113.917 0-27.218-5.284-53.249-15.852-78.087-10.561-24.842-24.838-46.254-42.825-64.241-17.987-17.987-39.396-32.264-64.233-42.826C254.246 5.285 228.217.003 200.999.003c-27.216 0-53.247 5.282-78.085 15.847C98.072 26.412 76.66 40.689 58.673 58.676c-17.989 17.987-32.264 39.403-42.827 64.241C5.282 147.758 0 173.786 0 201.004c0 27.216 5.282 53.238 15.846 78.083 10.562 24.838 24.838 46.247 42.827 64.234 17.987 17.993 39.403 32.264 64.241 42.832 24.841 10.563 50.869 15.844 78.085 15.844 41.879 0 79.852-11.807 113.922-35.405l97.929 97.641c6.852 7.231 15.406 10.849 25.693 10.849 9.897 0 18.467-3.617 25.694-10.849 7.23-7.23 10.848-15.796 10.848-25.693.003-10.082-3.518-18.651-10.561-25.694zM291.363 291.358c-25.029 25.033-55.148 37.549-90.364 37.549-35.21 0-65.329-12.519-90.36-37.549-25.031-25.029-37.546-55.144-37.546-90.36 0-35.21 12.518-65.334 37.546-90.36 25.026-25.032 55.15-37.546 90.36-37.546 35.212 0 65.331 12.519 90.364 37.546 25.033 25.026 37.548 55.15 37.548 90.36 0 35.216-12.519 65.331-37.548 90.36z"></path>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
