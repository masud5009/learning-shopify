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
import { useEffect, useState } from "react";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";

export async function loader() {
  //get data from database or api
  let data = {
    name: "data come from database or api",
    description: "this description also come from database or api"
  };
  return data;
}


export async function action({ request }) {
  const formData = await request.formData();
  const name = String(formData.get("name") || "");
  const description = String(formData.get("description") || "");

  //save data to database or api
  return {
    ok: true,
    saved: {
      name,
      description,
    },
  };
}


export default function Settings() {
  const settingData = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();

  const [formState, setFormSaved] = useState(settingData);
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.saved) {
      setFormSaved(actionData.saved);
    }
  }, [actionData]);

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
            <Form method="post">
              <BlockStack gap="400">
                {actionData?.ok ? (
                  <Text as="p" variant="bodyMd">
                    Settings saved successfully.
                  </Text>
                ) : null}

                <TextField
                  label="App Name"
                  name="name"
                  onChange={(value) => setFormSaved({ ...formState, name: value })}
                  autoComplete="off"
                  value={formState.name}
                />
                <TextField
                  label="App Description"
                  name="description"
                  onChange={(value) =>
                    setFormSaved({ ...formState, description: value })
                  }
                  autoComplete="off"
                  value={formState.description}
                />
                <Button submit loading={isSubmitting}>Save</Button>
              </BlockStack>
            </Form>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
