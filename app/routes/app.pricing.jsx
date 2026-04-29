import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  List,
  Badge,
  Box,
} from "@shopify/polaris";
import { Form, redirect, useLoaderData } from "react-router";
import { authenticate, MONTHLY_PLAN } from "../shopify.server";

export async function loader({ request }) {
  const { billing } = await authenticate.admin(request);

  const billingCheck = await billing.check({
    plans: [MONTHLY_PLAN],
    isTest: true,
  });

  return {
    hasProPlan: billingCheck.hasActivePayment,
  };
}

export async function action({ request }) {
  const { billing } = await authenticate.admin(request);

  const billingCheck = await billing.check({
    plans: [MONTHLY_PLAN],
    isTest: true,
  });

  if (billingCheck.hasActivePayment) {
    return redirect("/app/pricing");
  }

  return await billing.request({
    plan: MONTHLY_PLAN,
    isTest: true,
    returnUrl: new URL("/app/pricing", request.url).toString(),
  });
}

export default function PricingPage() {
  const { hasProPlan } = useLoaderData();

  return (
    <Page title="Pricing">
      <Layout>
        <Layout.Section>
          <Box paddingBlockEnd="600">
            <BlockStack gap="200">
              <Text as="h1" variant="headingXl">Choose your plan</Text>
              <Text as="p" tone="subdued">
                Start free, upgrade when you need advanced badge rules.
              </Text>
            </BlockStack>
          </Box>

          <InlineStack gap="500" align="center" blockAlign="stretch">
            <Card>
              <Box padding="500" minWidth="320px">
                <BlockStack gap="500">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingLg">Free</Text>
                    {!hasProPlan && <Badge tone="success">Current</Badge>}
                  </InlineStack>

                  <Text as="p" variant="heading2xl">$0</Text>

                  <List>
                    <List.Item>Basic trust badge</List.Item>
                    <List.Item>3 badge messages</List.Item>
                    <List.Item>Theme app extension</List.Item>
                    <List.Item>Product-specific message</List.Item>
                  </List>

                  <Button disabled fullWidth>
                    {!hasProPlan ? "Current plan" : "Free plan"}
                  </Button>
                </BlockStack>
              </Box>
            </Card>

            <Card>
              <Box padding="500" minWidth="320px">
                <BlockStack gap="500">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingLg">Pro</Text>
                    {hasProPlan ? (
                      <Badge tone="success">Current</Badge>
                    ) : (
                      <Badge tone="attention">Recommended</Badge>
                    )}
                  </InlineStack>

                  <Text as="p" variant="heading2xl">$5</Text>

                  <List>
                    <List.Item>Unlimited badges</List.Item>
                    <List.Item>Price-based rules</List.Item>
                    <List.Item>Product-specific messages</List.Item>
                    <List.Item>Priority support</List.Item>
                  </List>

                  {hasProPlan ? (
                    <Button disabled fullWidth>Current plan</Button>
                  ) : (
                    <Form method="post" reloadDocument>
                      <Button submit variant="primary" fullWidth>
                        Upgrade to Pro
                      </Button>
                    </Form>
                  )}
                </BlockStack>
              </Box>
            </Card>
          </InlineStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
