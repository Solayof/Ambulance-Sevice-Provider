import { Button} from "../src/ui/Button";
import { Input } from "../src/ui/Input";

export default function RequestForm() {
  return (
    <form className="space-y-4">
      {/* TODO: Add fields for caller_name, phone, address, emergency_description, etc. */}
      <Input placeholder="Name" />
      <Input placeholder="Phone" />
      <Input placeholder="Address" />
      <Input placeholder="Emergency Description" />
      <Button type="submit">Request Ambulance</Button>
    </form>
  );
}
