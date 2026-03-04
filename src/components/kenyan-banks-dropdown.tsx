// src/components/kenyan-banks-dropdown.tsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

// Comprehensive list of Kenyan banks
export const KENYAN_BANKS = [
  { name: "KCB Bank Kenya", code: "KCBK", swift: "KCBLKENX" },
  { name: "Equity Bank", code: "EQBL", swift: "EQBLKENA" },
  { name: "Co-operative Bank", code: "COOP", swift: "KCOOKENA" },
  { name: "Absa Bank Kenya", code: "ABSA", swift: "BARBKENA" },
  { name: "Standard Chartered Bank", code: "SCBK", swift: "SCBLKENX" },
  { name: "NCBA Bank", code: "NCBA", swift: "CBAFKENX" },
  { name: "Diamond Trust Bank (DTB)", code: "DTBK", swift: "DTKEKENA" },
  { name: "Stanbic Bank", code: "SBIC", swift: "SBICKENX" },
  { name: "I&M Bank", code: "IMBL", swift: "IMBLKENA" },
  { name: "Bank of Baroda", code: "BARB", swift: "BARBKENA" },
  { name: "Family Bank", code: "FAM", swift: "FAMIKENA" },
  { name: "National Bank of Kenya", code: "NBK", swift: "NBKEKENX" },
  { name: "Prime Bank", code: "PRIM", swift: "PRIMKENA" },
  { name: "Sidian Bank", code: "SIDIAN", swift: "SIDIKENA" },
  { name: "Consolidated Bank", code: "CONS", swift: "CONSKENA" },
  { name: "Credit Bank", code: "CREDIT", swift: "CRBDKENA" },
  { name: "Development Bank of Kenya", code: "DBK", swift: "DEVKKENA" },
  { name: "Guaranty Trust Bank (GTBank)", code: "GTBI", swift: "GTBIKENA" },
  { name: "Gulf African Bank", code: "GULF", swift: "GULFKENA" },
  { name: "Habib Bank", code: "HABIB", swift: "HABBKENA" },
  { name: "Housing Finance Bank", code: "HF", swift: "HFCKKENA" },
  { name: "Kingdom Bank", code: "KING", swift: "KBSOKENA" },
  { name: "Mayfair Bank", code: "MAYF", swift: "MAYFKENA" },
  { name: "M-Oriental Bank", code: "ORNT", swift: "ORNTKENA" },
  { name: "Paramount Bank", code: "PARA", swift: "PARAKENA" },
  { name: "SBM Bank Kenya", code: "SBM", swift: "SBMLKENA" },
  { name: "Spire Bank", code: "SPIR", swift: "SPIRKENA" },
  { name: "Transnational Bank", code: "TNB", swift: "TNBKKENA" },
  { name: "United Bank for Africa (UBA)", code: "UBAK", swift: "UBAFKENA" },
  { name: "Victoria Commercial Bank", code: "VIC", swift: "VICOKENA" },
  {
    name: "African Banking Corporation (ABC Bank)",
    code: "ABC",
    swift: "ABCKENA",
  },
  { name: "Bank of Africa", code: "BOA", swift: "BOFAKENX" },
  { name: "Citibank", code: "CITI", swift: "CITIKENX" },
  { name: "Dubai Bank Kenya", code: "DUBA", swift: "DUBAKENA" },
  { name: "Ecobank Kenya", code: "ECOC", swift: "ECOCHKENA" },
  { name: "First Community Bank", code: "FCB", swift: "FCOMKENA" },
  { name: "Guardian Bank", code: "GUAR", swift: "GUARKENA" },
  { name: "Habib Bank AG Zurich", code: "HBZ", swift: "HBZKKENA" },
  { name: "Middle East Bank (MEB)", code: "MEBK", swift: "MEBKKENA" },
  { name: "Postbank", code: "PBK", swift: "PBKOKENA" },
].sort((a, b) => a.name.localeCompare(b.name));

interface KenyanBanksDropdownProps {
  value: string;
  onChange: (bankName: string, bankCode: string, swiftCode: string) => void;
  placeholder?: string;
  className?: string;
}

export function KenyanBanksDropdown({
  value,
  onChange,
  placeholder = "Search and select a bank...",
  className = "",
}: KenyanBanksDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredBanks = KENYAN_BANKS.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedBank = KENYAN_BANKS.find((bank) => bank.name === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredBanks.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredBanks.length
          ) {
            const bank = filteredBanks[highlightedIndex];
            onChange(bank.name, bank.code, bank.swift);
            setIsOpen(false);
            setSearchTerm("");
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearchTerm("");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredBanks, highlightedIndex, onChange]);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <span className={selectedBank ? "text-gray-900" : "text-gray-500"}>
          {selectedBank ? selectedBank.name : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightedIndex(-1);
                }}
                placeholder="Type to search banks..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div ref={listRef} className="max-h-60 overflow-y-auto">
            {filteredBanks.length > 0 ? (
              filteredBanks.map((bank, index) => (
                <button
                  key={bank.code}
                  type="button"
                  onClick={() => {
                    onChange(bank.name, bank.code, bank.swift);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`w-full px-4 py-2 text-left hover:bg-purple-50 transition-colors ${
                    value === bank.name
                      ? "bg-purple-50 text-main font-medium"
                      : ""
                  } ${highlightedIndex === index ? "bg-purple-50" : ""}`}
                >
                  <div className="text-sm text-gray-900">{bank.name}</div>
                  <div className="text-xs text-gray-500">Code: {bank.code}</div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No banks found matching "{searchTerm}"
              </div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
            {filteredBanks.length} bank{filteredBanks.length !== 1 ? "s" : ""}{" "}
            found
          </div>
        </div>
      )}
    </div>
  );
}
