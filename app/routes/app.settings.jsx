import {
  Page,
  BlockStack,
  InlineGrid,
  Box,
  Card,
  TextField,
  Text,
  Button
} from "@shopify/polaris";
import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  //get data from database or api
  let data = {
    name: "data come from database or api",
    description: "this description also come from database or api"
  };
  return json(data);
}


export async function action() {
  // updates persistent data
}


export default function Settings() {
  const settingData = useLoaderData();

  const [formState, setFormSaved] = useState(settingData);

  return (
    <Page
      // title="App Settings"
      divider
      primaryAction={{ content: "View on your store", disabled: true }}
      secondaryActions={[
        {
          content: "Duplicate",
          accessibilityLabel: "Duplicate settings",
          onAction: () => alert("Action Here"),
        },
      ]}
    >
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: "400", sm: "0" }}
            paddingInlineEnd={{ xs: "400", sm: "0" }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Settings
              </Text>
              <Text as="p" variant="bodyMd">
                Update app settings and preferences
              </Text>
            </BlockStack>
          </Box>

          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <TextField label="App Name" onChange={(value) => setFormSaved({ ...formState, name: value })} autoComplete="off" value={formState.name} />
              <TextField label="App Description" onChange={(value) => setFormSaved({ ...formState, description: value })} autoComplete="off" value={formState.description} />
              <Button submit={true}>Save</Button>
            </BlockStack>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
