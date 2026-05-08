"use client";

import "@/styles/subs.css";
import { useState } from "react";
import { SubsPage } from "@/screens/subs/SubsPage";
import { AddSubSheet } from "@/screens/mobile/sheets/AddSubSheet";

export default function Page() {
  const [addOpen, setAddOpen] = useState(false);
  return (
    <>
      <SubsPage onAdd={() => setAddOpen(true)} />
      <AddSubSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
