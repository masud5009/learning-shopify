import {
  Page,
  BlockStack,
  InlineGrid,
  Box,
  Card,
  TextField,
  ChoiceList,
  Text,
  Button,
  ColorPicker
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
    badge_2: setting?.badge_2 || "",
    badge_3: setting?.badge_3 || "",
    bg_color: setting?.bg_color || "",
    is_enabled: setting?.is_enabled ? "true" : "false",
    premium_threshold: setting?.premium_threshold || 0,
    premium_message: setting?.premium_message || "",
    budget_threshold: setting?.budget_threshold || 0,
    budget_message: setting?.budget_message || "",
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
      badge_2: setting?.badge_2 || "",
      badge_3: setting?.badge_3 || "",
      bg_color: setting.bg_color,
      is_enabled: isEnabled,
      premium_threshold: parseInt(setting.premium_threshold) || 0,
      premium_message: setting.premium_message,
      budget_threshold: parseInt(setting.budget_threshold) || 0,
      budget_message: setting.budget_message,
    },
    create: {
      id: "1",
      badge_heading: setting.badge_heading,
      default_badge_message: setting.default_badge_message,
      badge_2: setting?.badge_2 || "",
      badge_3: setting?.badge_3 || "",
      bg_color: setting.bg_color,
      is_enabled: isEnabled,
      premium_threshold: parseInt(setting.premium_threshold) || 0,
      premium_message: setting.premium_message,
      budget_threshold: parseInt(setting.budget_threshold) || 0,
      budget_message: setting.budget_message,
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
    badges: [
      setting.default_badge_message,
      setting.badge_2,
      setting.badge_3,
    ],
    thresholds: [
      {
        threshold: parseInt(setting.premium_threshold) || 0,
        message: setting.premium_message,
      },
      {
        threshold: parseInt(setting.budget_threshold) || 0,
        message: setting.budget_message,
      },
    ],
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
    divider
  >
    <BlockStack gap={{ xs: "800", sm: "400" }}>
      <InlineGrid columns={{ xs: "1fr", md: "1fr 2fr" }} gap="400">

        {/* LEFT: Preview */}
        <Card roundedAbove="sm">
          <Box padding="400">
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Preview
              </Text>

              <div
                style={{
                  background: formState.bg_color || "#ffffff",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #e5e5e5",
                }}
              >
                {formState.badge_heading && <h3>{formState.badge_heading}</h3>}

                {formState.default_badge_message && (
                  <p>{formState.default_badge_message}</p>
                )}

                {formState.badge_2 && <p>{formState.badge_2}</p>}

                {formState.badge_3 && <p>{formState.badge_3}</p>}
              </div>
            </BlockStack>
          </Box>
        </Card>

        {/* RIGHT: Form */}
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
                onChange={(value) =>
                  setFormSaved({ ...formState, badge_heading: value })
                }
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
                label="Badge 2"
                name="badge_2"
                onChange={(value) =>
                  setFormSaved({ ...formState, badge_2: value })
                }
                value={formState.badge_2 || ""}
              />

              <TextField
                label="Badge 3"
                name="badge_3"
                onChange={(value) =>
                  setFormSaved({ ...formState, badge_3: value })
                }
                value={formState.badge_3 || ""}
              />

              <TextField
                label="Premium Threshold"
                name="premium_threshold"
                type="number"
                onChange={(value) =>
                  setFormSaved({
                    ...formState,
                    premium_threshold: parseInt(value) || 0,
                  })
                }
                value={String(formState.premium_threshold || 0)}
              />

              <TextField
                label="Premium Message"
                name="premium_message"
                onChange={(value) =>
                  setFormSaved({ ...formState, premium_message: value })
                }
                value={formState.premium_message || ""}
              />

              <TextField
                label="Budget Threshold"
                name="budget_threshold"
                type="number"
                onChange={(value) =>
                  setFormSaved({
                    ...formState,
                    budget_threshold: parseInt(value) || 0,
                  })
                }
                value={String(formState.budget_threshold || 0)}
              />

              <TextField
                label="Budget Message"
                name="budget_message"
                onChange={(value) =>
                  setFormSaved({ ...formState, budget_message: value })
                }
                value={formState.budget_message || ""}
              />

              <TextField
                type="color"
                label="Background Color"
                name="bg_color"
                value={formState.bg_color || "#ffffff"}
                onChange={(value) =>
                  setFormSaved({ ...formState, bg_color: value })
                }
              />

              <ChoiceList
                title="Is Enabled"
                name="is_enabled"
                choices={[
                  { label: "Hidden", value: "false" },
                  { label: "Shown", value: "true" },
                ]}
                selected={
                  formState.is_enabled === "true" ? ["true"] : ["false"]
                }
                onChange={(value) =>
                  setFormSaved({ ...formState, is_enabled: value[0] })
                }
              />

              <Button submit loading={isSubmitting}>
                Save
              </Button>
            </BlockStack>
          </Form>
        </Card>
      </InlineGrid>
    </BlockStack>
  </Page>
);
}
