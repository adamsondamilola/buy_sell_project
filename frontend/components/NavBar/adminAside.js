"use client";
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import AppImages from "../../constants/Images";
import { Sidebar } from "flowbite-react";
import { ArrowRight, ChartPie, Inbox, ShoppingBag, Table, User, Users } from "lucide-react";
import requestHandler from "../../utils/requestHandler";
import { Category, Home, House, Login, Logout, Password, Person, Sell, Settings } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const AdminAsideComponent = () => {
    const router = useRouter()

    const logOut = () => {
      localStorage.removeItem('token')
      router.push("/")
    }

    return (
        <Sidebar className="w-full" aria-label="Sidebar with multi-level dropdown example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
        <Sidebar.Item href="/" icon={Home}>
            Home
          </Sidebar.Item>
          <Sidebar.Item href="/admin" icon={ChartPie}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Collapse label="Post Settings" icon={Settings}>            
          <Sidebar.Item href="/admin/setting/categories">
            Categories
          </Sidebar.Item>
          <Sidebar.Item href="/admin/setting/brands">
            Brands
          </Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Collapse label="Products" icon={Sell}>            
          <Sidebar.Item href="/admin/products">
            All
          </Sidebar.Item>
          <Sidebar.Item href="/admin/products/pending">
            Pending
          </Sidebar.Item>
          <Sidebar.Item href="/admin/products/approved">
            Approved
          </Sidebar.Item>
          <Sidebar.Item href="/admin/products/rejected">
            Rejected
          </Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Collapse label="Users" icon={Users}>            
          <Sidebar.Item href="/admin/users">
            All
          </Sidebar.Item>
          <Sidebar.Item href="/admin/users/shops">
            Shops
          </Sidebar.Item>
          <Sidebar.Item href="/admin/users/verified">
            Verified
          </Sidebar.Item>
          <Sidebar.Item href="/admin/users/blocked">
            Blocked
          </Sidebar.Item>
          </Sidebar.Collapse>
                    <Sidebar.Items>
                    <Sidebar.Item href="/admin/profile" icon={Person}>
                      Profile
                    </Sidebar.Item>
                    <Sidebar.Item href="/admin/profile/password-update" icon={Password}>
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

export default AdminAsideComponent