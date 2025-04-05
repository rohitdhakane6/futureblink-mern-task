import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  Upload,
  MapPin,
  Eye,
  Info,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import * as XLSX from "xlsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import axios from "axios";

const steps = [
  { label: "Lead Source", icon: <Upload className="size-6" /> },
  { label: "Map", icon: <MapPin className="size-6" /> },
  { label: "Verify", icon: <Eye className="size-6" /> },
  { label: "Details", icon: <Info className="size-6" /> },
];

const predefinedFields = [
  "first name",
  "last name",
  "email",
  "company",
  "phone",
  "address",
  "city",
  "state",
  "zip",
  "country",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function ImportList({closeDilog}:{ closeDilog:() => void}) {
  const [step, setStep] = useState(0);
  const [fileData, setFileData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<{ [key: string]: string }>(
    {}
  );
  const [fileUploaded, setFileUploaded] = useState(false);
  const [listDetails, setListDetails] = useState({
    listName: "",
    description: "",
  });
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoMappingComplete, setAutoMappingComplete] = useState(false);

  // Auto-map fields when headers change - fixed to prevent infinite loop
  useEffect(() => {
    if (headers.length > 0 && !autoMappingComplete) {
      const autoMapping: { [key: string]: string } = {};

      headers.forEach((header) => {
        // Try to find matching field by normalizing and comparing
        const normalizedHeader = header
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]/g, "");

        for (const field of predefinedFields) {
          if (
            normalizedHeader.includes(field) ||
            field.includes(normalizedHeader)
          ) {
            autoMapping[header] = field;
            break;
          }
        }
      });

      setFieldMapping(autoMapping);
      setAutoMappingComplete(true); // Prevent further auto-mapping
    }
  }, [headers, autoMappingComplete]);

  const handleFileUpload = (files: File[]) => {
    if (!files || !files.length) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        if (!e.target || !e.target.result) {
          setValidationErrors({ file: "Failed to read file" });
          return;
        }

        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        if (
          !workbook ||
          !workbook.SheetNames ||
          workbook.SheetNames.length === 0
        ) {
          setValidationErrors({ file: "Invalid Excel file structure" });
          return;
        }

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (!jsonData || !Array.isArray(jsonData) || jsonData.length < 2) {
          setValidationErrors({
            file: "File must contain headers and at least one row of data",
          });
          return;
        }

        // Ensure first row contains string headers
        const headerRow = jsonData[0];
        if (
          !Array.isArray(headerRow) ||
          headerRow.some((h) => typeof h !== "string")
        ) {
          setValidationErrors({ file: "File headers must be text values" });
          return;
        }

        setHeaders(headerRow as string[]);
        setFileData(jsonData.slice(1));
        setFileUploaded(true);
        setValidationErrors({});
        setAutoMappingComplete(false); // Reset for new file
        setStep(1); // Move to the next step (Map)
      } catch (error) {
        console.error("File processing error:", error);
        setValidationErrors({
          file: "Invalid file format. Please upload a valid Excel file.",
        });
      }
    };

    reader.onerror = () => {
      setValidationErrors({ file: "Error reading file" });
    };

    reader.readAsArrayBuffer(file);
  };

  const handleMappingChange = (excelField: string, dbField: string) => {
    if (dbField == "skipfield") {
      setFieldMapping((prev) => {
        const updatedMapping = { ...prev };
        delete updatedMapping[excelField];
        return updatedMapping;
      });
    } else {
      setFieldMapping((prev) => ({ ...prev, [excelField]: dbField }));
    }
  };

  const validateMapping = () => {
    // Check if at least one field is mapped
    const mappedFields = Object.values(fieldMapping).filter(Boolean);
    if (mappedFields.length === 0) {
      setValidationErrors({ mapping: "Please map at least one field" });
      return false;
    }
    // Check for duplicate mappings
    const uniqueMappedFields = new Set(mappedFields);
    if (uniqueMappedFields.size !== mappedFields.length) {
      setValidationErrors({
        mapping: "Duplicate field mappings found",
      });
      return false;
    }
    // Check if email field is mapped
    if (!mappedFields.includes("email")) {
      setValidationErrors({
        mapping: "Email field must be mapped",
      });
      return false;
    }


    setValidationErrors({});
    return true;
  };

  const validateListDetails = () => {
    if (!listDetails.listName || listDetails.listName.length < 3) {
      setValidationErrors({
        listName: "List name must be at least 3 characters",
      });
      return false;
    }

    setValidationErrors({});
    return true;
  };

  const handleListDetailsChange = (field: string, value: string) => {
    setListDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1 && !validateMapping()) return;
    if (step === 2 && !validateListDetails()) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    if (!validateListDetails()) return;

    setIsSubmitting(true);
    try {
      const mappedData = fileData.map((row) => {
        const mappedRow: { [key: string]: any } = {};
        headers.forEach((header, index) => {
          if (fieldMapping[header]) {
            mappedRow[fieldMapping[header]] = row[index];
          }
        });
        return mappedRow;
      });

      await axios.post("/list", {
        leads: mappedData,
        listName: listDetails.listName,
        description: listDetails.description
      });
      console.log("Leads to be imported:", mappedData);
      console.log("List details:", listDetails);
      setStep(3); // Move to success step
    } catch (error) {
      console.error("Submission error:", error);
      setValidationErrors({
        submit: "Failed to import leads. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="m-2 p-5 border rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        {steps.map((s, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              step >= index ? "text-blue-500" : "text-gray-400"
            }`}
          >
            {s.icon}
            <span className="text-sm mt-1">{s.label}</span>
          </div>
        ))}
      </div>

      {step === 0 && (
        <motion.div
          className="flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            variants={itemVariants}
            className="text-lg font-semibold mb-4"
          >
            Upload Lead Source File
          </motion.h2>
          <motion.div variants={itemVariants}>
            <Input
              type="file"
              accept=".xlsx, .xls , .csv"
              onChange={(e) => {
                if (e.target.files) {
                  handleFileUpload(Array.from(e.target.files));
                }
              }}
              className="mb-4"
            />
          </motion.div>

          {validationErrors.file && (
            <motion.div
              variants={itemVariants}
              className="mt-4 text-red-500 flex items-center"
            >
              <AlertCircle className="size-4 mr-2" />
              {validationErrors.file}
            </motion.div>
          )}
        </motion.div>
      )}

      {step === 1 && fileUploaded && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            variants={itemVariants}
            className="text-lg font-semibold mb-4 text-center"
          >
            Map Fields
          </motion.h2>

          {headers.map((header) => (
            <motion.div
              key={header}
              className="flex items-center mb-3 justify-evenly"
              variants={itemVariants}
            >
              <span className="w-40">{header}</span>

              <Select
                onValueChange={(value) => {
                  setValidationErrors({});
                  handleMappingChange(header, value);
                }}
              >
                <SelectTrigger
                  className={`w-48 ${
                    fieldMapping[header]
                      ? "border-blue-500"
                      : "border-destructive"
                  }`}
                >
                  <span className="capitalize text-black">
                    {fieldMapping[header] || "Select Field"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      value="skipfield"
                      className="capitalize text-destructive focus:text-destructive"
                    >
                      Skip Fiels
                    </SelectItem>
                    {predefinedFields.map((field) => (
                      <SelectItem
                        key={field}
                        value={field}
                        className="capitalize"
                      >
                        {field}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </motion.div>
          ))}

          {validationErrors.mapping && (
            <motion.div
              variants={itemVariants}
              className="mt-2 mb-4 text-red-500 flex items-center justify-center"
            >
              <AlertCircle className="size-4 mr-2" />
              {validationErrors.mapping}
            </motion.div>
          )}

          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-4 mt-6"
          >
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Button>
            <Button onClick={handleNext}>Next</Button>
          </motion.div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            variants={itemVariants}
            className="text-lg font-semibold mb-4 text-center"
          >
            List Details & Verification
          </motion.h2>

          <motion.div variants={itemVariants} className="mb-6">
            <label className="block mb-2">List Name</label>
            <Input
              value={listDetails.listName}
              onChange={(e) =>
                handleListDetailsChange("listName", e.target.value)
              }
              placeholder="Enter list name"
              className={validationErrors.listName ? "border-red-500" : ""}
            />
            {validationErrors.listName && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.listName}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <label className="block mb-2">Description (Optional)</label>
            <Input
              value={listDetails.description}
              onChange={(e) =>
                handleListDetailsChange("description", e.target.value)
              }
              placeholder="Enter description"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="font-medium mb-2">Preview (First 3 Rows)</h3>
            <div className="p-3 bg-gray-100 rounded overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="capitalize">
                    {Object.values(fieldMapping)
                      .filter(Boolean)
                      .map((field) => (
                        <th key={field} className="px-3 py-2 text-left">
                          {field}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {fileData.slice(0, 3).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.entries(fieldMapping)
                        .filter(([_, value]) => Boolean(value))
                        .map(([header, _], colIndex) => {
                          const headerIndex = headers.indexOf(header);
                          return (
                            <td key={colIndex} className="px-3 py-2 border-t">
                              {headerIndex >= 0 && headerIndex < row.length
                                ? row[headerIndex]
                                : ""}
                            </td>
                          );
                        })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {validationErrors.submit && (
            <motion.div
              variants={itemVariants}
              className="mb-4 text-red-500 flex items-center justify-center"
            >
              <AlertCircle className="size-4 mr-2" />
              {validationErrors.submit}
            </motion.div>
          )}

          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-4"
          >
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Importing..." : "Import Leads"}
            </Button>
          </motion.div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-4"
          >
            <CheckCircle className="size-16 text-green-500" />
            <h2 className="text-xl font-semibold">
              Leads Imported Successfully
            </h2>
            <p>
              {fileData.length} leads have been imported to list "
              {listDetails.listName}"
            </p>
            <Button onClick={() => closeDilog()}>Close</Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
