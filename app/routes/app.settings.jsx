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
import { authenticate } from "../shopify.server";

//import db connection
import db from "../db.server";

export async function loader() {
  //get data from database or api
  let setting = await db.settings.findFirst();

  let data = {
    badge_heading: setting?.badge_heading || "",
    default_badge_message: setting?.default_badge_message || "",
    bg_color: setting?.bg_color || "",
    is_enabled: setting?.is_enabled || true
  };
  return data;
}


export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  let formData = await request.formData();
  let setting = Object.fromEntries(formData);

  const isEnabled = setting.is_enabled === "true";

  await db.settings.upsert({
    where: { id: "1" },
    update: {
      badge_heading: setting.badge_heading,
      default_badge_message: setting.default_badge_message,
      bg_color: setting.bg_color,
      is_enabled: isEnabled,
    },
    create: {
      id: "1",
      badge_heading: setting.badge_heading,
      default_badge_message: setting.default_badge_message,
      bg_color: setting.bg_color,
      is_enabled: isEnabled,
    },
  });

  // 1. Get current shop ID
  const shopResponse = await admin.graphql(`
    query {
      shop {
        id
      }
    }
  `);

  const shopData = await shopResponse.json();
  const shopId = shopData.data.shop.id;

  // 2. Save settings to Shopify shop metafield
  const metafieldValue = JSON.stringify({
    enabled: isEnabled,
    heading: setting.badge_heading,
    message: setting.default_badge_message,
    bgColor: setting.bg_color,
  });

  const metafieldResponse = await admin.graphql(
    `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        metafields: [
          {
            ownerId: shopId,
            namespace: "trust_badge",
            key: "settings",
            type: "json",
            value: metafieldValue,
          },
        ],
      },
    }
  );

  const metafieldData = await metafieldResponse.json();

  if (metafieldData.data.metafieldsSet.userErrors.length) {
    console.log("Metafield errors:", metafieldData.data.metafieldsSet.userErrors);
  }

  return { saved: { ...setting, is_enabled: isEnabled } };
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
                {actionData?.saved ? (
                  <Text as="p" variant="bodyMd">
                    Settings saved successfully.
                  </Text>
                ) : null}

                <TextField
                  label="Badge Heading"
                  name="badge_heading"
                  onChange={(value) => setFormSaved({ ...formState, badge_heading: value })}
                  autoComplete="off"
                  value={formState.badge_heading}
                />
                <TextField
                  label="Default Badge Message"
                  name="default_badge_message"
                  onChange={(value) =>
                    setFormSaved({ ...formState, default_badge_message: value })
                  }
                  autoComplete="off"
                  value={formState.default_badge_message}
                />
                <TextField
                  label="Background Color"
                  name="bg_color"
                  onChange={(value) =>
                    setFormSaved({ ...formState, bg_color: value })
                  }
                  autoComplete="off"
                  value={formState.bg_color}
                />
                <TextField
                  label="Is Enabled"
                  name="is_enabled"
                  onChange={(value) =>
                    setFormSaved({ ...formState, is_enabled: value })
                  }
                  autoComplete="off"
                  value={formState.is_enabled}
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
