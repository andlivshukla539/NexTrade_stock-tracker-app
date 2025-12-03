"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Plus, Bell } from "lucide-react";
import { toast } from "sonner";

interface Alert {
    _id: string;
    symbol: string;
    targetPrice: number;
    condition: "ABOVE" | "BELOW";
    triggered: boolean;
}

export default function AlertsList() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [newAlert, setNewAlert] = useState({
        symbol: "",
        targetPrice: "",
        condition: "ABOVE",
    });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const res = await fetch("/api/alerts");
            const data = await res.json();
            if (Array.isArray(data)) {
                setAlerts(data);
            }
        } catch (error) {
            console.error("Failed to fetch alerts", error);
        } finally {
            setLoading(false);
        }
    };

    const createAlert = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAlert.symbol || !newAlert.targetPrice) return;

        setIsCreating(true);
        try {
            const res = await fetch("/api/alerts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    symbol: newAlert.symbol,
                    targetPrice: parseFloat(newAlert.targetPrice),
                    condition: newAlert.condition,
                }),
            });

            if (res.ok) {
                toast.success("Alert created successfully");
                setNewAlert({ symbol: "", targetPrice: "", condition: "ABOVE" });
                fetchAlerts();
            } else {
                toast.error("Failed to create alert");
            }
        } catch (error) {
            console.error("Error creating alert", error);
            toast.error("Something went wrong");
        } finally {
            setIsCreating(false);
        }
    };

    const deleteAlert = async (id: string) => {
        try {
            const res = await fetch(`/api/alerts/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Alert deleted");
                setAlerts(alerts.filter((a) => a._id !== id));
            }
        } catch (error) {
            console.error("Error deleting alert", error);
        }
    };

    return (
        <div className="w-full bg-gray-800 border border-gray-600 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-100">Price Alerts</h2>
            </div>

            {/* Create Alert Form */}
            <form onSubmit={createAlert} className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Symbol (e.g. AAPL)"
                    value={newAlert.symbol}
                    onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-gray-100 rounded px-3 py-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                />
                <select
                    value={newAlert.condition}
                    onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-gray-100 rounded px-3 py-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                    <option value="ABOVE">Above</option>
                    <option value="BELOW">Below</option>
                </select>
                <input
                    type="number"
                    placeholder="Target Price"
                    value={newAlert.targetPrice}
                    onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-gray-100 rounded px-3 py-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                    step="0.01"
                />
                <button
                    type="submit"
                    disabled={isCreating}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" />
                    Set Alert
                </button>
            </form>

            {/* Alerts List */}
            <div className="space-y-3">
                {loading ? (
                    <p className="text-gray-500 text-center py-4">Loading alerts...</p>
                ) : alerts.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No active alerts</p>
                ) : (
                    alerts.map((alert) => (
                        <div
                            key={alert._id}
                            className="flex items-center justify-between bg-gray-700/50 p-3 rounded border border-gray-600"
                        >
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-gray-200 w-16">{alert.symbol}</span>
                                <span className="text-sm text-gray-400">
                                    {alert.condition === "ABOVE" ? "goes above" : "drops below"}
                                </span>
                                <span className="font-mono text-yellow-500 font-medium">
                                    ${alert.targetPrice}
                                </span>
                                {alert.triggered && (
                                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                                        Triggered
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => deleteAlert(alert._id)}
                                className="text-gray-500 hover:text-red-400 transition-colors p-1"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
