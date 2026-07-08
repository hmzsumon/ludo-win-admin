"use client";

import { useGetAdminTransactionByIdQuery } from "@/redux/features/admin/adminApi";
import { ListGroup } from "flowbite-react";
import Link from "next/link";
import { GridLoader } from "react-spinners";

const InfoRow = ({ label, value }: { label: string; value: any }) => (
  <ListGroup.Item>
    <span className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className="break-all text-right font-bold">{value || "N/A"}</span>
    </span>
  </ListGroup.Item>
);

const AdminTransactionDetailsPage = ({ params }: any) => {
  const { id } = params;
  const { data, isLoading } = useGetAdminTransactionByIdQuery(id);
  const tx = data?.transaction;
  const user = tx?.userId;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transaction Details</h1>
        <Link href="/transactions" className="text-blue-600 hover:underline">
          Back to transactions
        </Link>
      </div>

      {isLoading ? (
        <div className="my-6 flex items-center justify-center">
          <GridLoader color="#2563EB" size={30} />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* ────────── transaction info section ────────── */}
          <div>
            <h3 className="my-1 ml-2 font-bold">Transaction Info</h3>
            <ListGroup>
              <InfoRow label="Transaction ID" value={tx?.unique_id} />
              <InfoRow label="Type" value={tx?.transactionType} />
              <InfoRow label="Purpose" value={tx?.purpose} />
              <InfoRow label="Amount" value={Number(tx?.amount || 0).toFixed(2)} />
              <InfoRow label="Previous Balance" value={Number(tx?.previous_m_balance || 0).toFixed(2)} />
              <InfoRow label="Current Balance" value={Number(tx?.current_m_balance || 0).toFixed(2)} />
              <InfoRow label="Description" value={tx?.description} />
              <InfoRow label="External Ref" value={tx?.externalRef} />
              <InfoRow label="Created At" value={tx?.createdAt ? new Date(tx.createdAt).toLocaleString() : "N/A"} />
            </ListGroup>
          </div>

          {/* ────────── user info section ────────── */}
          <div>
            <h3 className="my-1 ml-2 font-bold">User/Bot Info</h3>
            <ListGroup>
              <InfoRow label="Name" value={user?.name} />
              <InfoRow label="Customer ID" value={tx?.customerId || user?.customerId} />
              <InfoRow label="Email" value={user?.email} />
              <InfoRow label="Phone" value={user?.phone} />
              <InfoRow label="Account Type" value={user?.is_bot ? "Bot" : "User"} />
              <InfoRow label="Status" value={user?.is_active ? "Active" : "Inactive"} />
            </ListGroup>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactionDetailsPage;
