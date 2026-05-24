"use client";

import DocxImportCard from "@/app/admin/_components/DocxImportCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function BankConfigModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+ Cấu hình bộ câu hỏi (DOCX)</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex items-start justify-between gap-4">
          <div>
            <DialogTitle>Bước 1 — Cấu hình bộ câu hỏi</DialogTitle>
            <DialogDescription>
              Upload DOCX để parse thành ngân hàng câu hỏi. Bạn có thể test trước 5 câu rồi tạo.
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Đóng
            </Button>
          </DialogClose>
        </DialogHeader>
        <DialogBody>
          <DocxImportCard />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
