import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { fetchEmployeeSearch } from "services/employees";
import { Employee } from "types/employee";

export interface SearchBarProps {
  onSearchResults: (results: Employee[]) => void;
}

export const SearchBar = ({ onSearchResults }: SearchBarProps) => {
  const [searchInput, setSearchInput] = useState<string>("");

  const getEmployeeSearch = async (searchString: string) => {
    try {
      const employees: Employee[] = await fetchEmployeeSearch(searchString);
      onSearchResults(employees);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : (err as string);
      toast.error(errorMessage);
    }
  };

  const onUpdateField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fieldInput = event.target.value;
    setSearchInput(fieldInput);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchInput.trim() !== "") getEmployeeSearch(searchInput);
  };

  useEffect(() => {
    if (searchInput !== "") {
      const search = setTimeout(() => {
        getEmployeeSearch(searchInput);
      }, 400);
      return () => clearTimeout(search);
    } else {
      onSearchResults([]);
    }
  }, [searchInput]);
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Control
        type="text"
        onChange={onUpdateField}
        value={searchInput}
        placeholder={"Name, seriennummer, ..."}
        id="searchbar"
        autoComplete="off"
      />
    </Form>
  );
};
