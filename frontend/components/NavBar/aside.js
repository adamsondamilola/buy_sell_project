"use client";
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import AppImages from "../../constants/Images";
import { Sidebar } from "flowbite-react";
import { ArrowRight, ChartPie, Inbox, ShoppingBag, Table, User } from "lucide-react";
import requestHandler from "../../utils/requestHandler";
import { Home, Login, Logout, Password, Person, Sell } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const AsideComponent = () => {
    const router = useRouter()

    const logOut = () => {
      localStorage.removeItem('token')
      router.push("/")
    }

    return (
        <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
        <Sidebar.Item href="/" icon={Home}>
            Home
          </Sidebar.Item>
          <Sidebar.Item href="/user/dashboard" icon={ChartPie}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="/user/shops" icon={Inbox}>
            Shops
          </Sidebar.Item>
          <Sidebar.Item href="/user/products" icon={Sell}>
            Products
          </Sidebar.Item>
                    <Sidebar.Items>
                    <Sidebar.Item href="/profile" icon={Person}>
                      Profile
                    </Sidebar.Item>
                    <Sidebar.Item href="/profile/password-update" icon={Password}>
                      Update Password
                    </Sidebar.Item>
                    <Sidebar.Item onClick={logOut} icon={Logout}>
                      Logout
                    </Sidebar.Item>
                    </Sidebar.Items>

        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
    )
}

export default AsideComponent