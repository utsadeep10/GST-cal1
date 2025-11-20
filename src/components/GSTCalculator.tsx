import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, RefreshCw } from "lucide-react";

type CalculationMode = "exclusive" | "inclusive";

const GST_RATES = [
  { label: "5%", value: 5 },
  { label: "12%", value: 12 },
  { label: "18%", value: 18 },
  { label: "28%", value: 28 },
];

export const GSTCalculator = () => {
  const [amount, setAmount] = useState<string>("");
  const [gstRate, setGstRate] = useState<number>(18);
  const [customRate, setCustomRate] = useState<string>("");
  const [mode, setMode] = useState<CalculationMode>("exclusive");

  const parseAmount = parseFloat(amount) || 0;
  const currentRate = customRate ? parseFloat(customRate) || 0 : gstRate;

  const calculateGST = () => {
    if (mode === "exclusive") {
      // Add GST to amount
      const gstAmount = (parseAmount * currentRate) / 100;
      const totalAmount = parseAmount + gstAmount;
      return {
        original: parseAmount,
        gst: gstAmount,
        total: totalAmount,
      };
    } else {
      // Extract GST from amount
      const originalAmount = (parseAmount * 100) / (100 + currentRate);
      const gstAmount = parseAmount - originalAmount;
      return {
        original: originalAmount,
        gst: gstAmount,
        total: parseAmount,
      };
    }
  };

  const result = calculateGST();

  const handleReset = () => {
    setAmount("");
    setCustomRate("");
    setGstRate(18);
    setMode("exclusive");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Calculator className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground">GST Calculator</h1>
        <p className="text-muted-foreground text-lg">
          Calculate GST inclusive and exclusive amounts instantly
        </p>
      </div>

      <Card className="p-6 shadow-[var(--shadow-elegant)] border-border/50">
        <div className="space-y-6">
          {/* Mode Toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setMode("exclusive")}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                mode === "exclusive"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              GST Exclusive
              <span className="block text-xs mt-1 opacity-80">Add GST to amount</span>
            </button>
            <button
              onClick={() => setMode("inclusive")}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                mode === "inclusive"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              GST Inclusive
              <span className="block text-xs mt-1 opacity-80">Extract GST from amount</span>
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-base font-medium">
              {mode === "exclusive" ? "Original Amount" : "Total Amount (with GST)"}
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                ₹
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-2xl h-14 pl-10 pr-4 font-semibold"
              />
            </div>
          </div>

          {/* GST Rate Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">GST Rate</Label>
            <div className="grid grid-cols-4 gap-2">
              {GST_RATES.map((rate) => (
                <button
                  key={rate.value}
                  onClick={() => {
                    setGstRate(rate.value);
                    setCustomRate("");
                  }}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    gstRate === rate.value && !customRate
                      ? "bg-secondary text-secondary-foreground border-2 border-primary"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 border-2 border-transparent"
                  }`}
                >
                  {rate.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="Custom rate (%)"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                className="h-11"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>

          {/* Results */}
          {parseAmount > 0 && (
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">
                  {mode === "exclusive" ? "Original Amount" : "Amount (excl. GST)"}
                </span>
                <span className="font-semibold text-lg">{formatCurrency(result.original)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">GST ({currentRate}%)</span>
                <span className="font-semibold text-lg text-accent">
                  {formatCurrency(result.gst)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                <span className="font-medium text-foreground">
                  {mode === "exclusive" ? "Total Amount (with GST)" : "Total Amount"}
                </span>
                <span className="font-bold text-2xl text-primary">{formatCurrency(result.total)}</span>
              </div>
            </div>
          )}

          {/* Reset Button */}
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full h-11"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Calculator
          </Button>
        </div>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4 bg-secondary/30 border-secondary">
          <h3 className="font-semibold text-secondary-foreground mb-2">GST Exclusive</h3>
          <p className="text-sm text-muted-foreground">
            Add GST to your base amount. Use this when you have the original price and need to
            calculate the final price with GST.
          </p>
        </Card>
        <Card className="p-4 bg-secondary/30 border-secondary">
          <h3 className="font-semibold text-secondary-foreground mb-2">GST Inclusive</h3>
          <p className="text-sm text-muted-foreground">
            Extract GST from the total amount. Use this when you have the final price and need to
            know the GST component.
          </p>
        </Card>
      </div>
    </div>
  );
};
